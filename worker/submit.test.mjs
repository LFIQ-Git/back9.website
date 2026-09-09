import assert from "node:assert/strict";
import test from "node:test";

import worker from "./index.mjs";
import { handleSubmit } from "./submit.mjs";

const endpoint = "https://backninetrades.com/api/submit";
const env = {
  RESEND_API_KEY: "test-key",
  LEAD_INBOX: "dispatch@example.com",
  LEAD_FROM: "Back9 Trades <portal@example.com>",
};

function request(body, options = {}) {
  return new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...options.headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("rejects methods other than POST", async () => {
  const response = await handleSubmit(new Request(endpoint), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
});

test("requires the Resend secret", async () => {
  const response = await handleSubmit(
    request({ name: "Jane", email: "jane@example.com", description: "Repair" }),
    {}
  );
  assert.equal(response.status, 500);
});

test("validates required fields and email", async () => {
  const missing = await handleSubmit(request({ name: "Jane" }), env);
  assert.equal(missing.status, 400);

  const invalidEmail = await handleSubmit(
    request({ name: "Jane", email: "invalid", description: "Repair" }),
    env
  );
  assert.equal(invalidEmail.status, 400);
});

test("cancels streamed request bodies that exceed the size limit", async () => {
  let chunksRead = 0;
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) {
      chunksRead += 1;
      controller.enqueue(new Uint8Array(32 * 1024));
    },
    cancel() {
      cancelled = true;
    },
  });
  const oversized = new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    duplex: "half",
  });

  const response = await handleSubmit(oversized, env);

  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  assert.ok(chunksRead < 4);
});

test("submits email and forwards a normalized payload", async () => {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, init });
    return new Response(null, { status: 200 });
  };
  const response = await handleSubmit(
    request({
      kind: "proposal",
      name: " Jane ",
      email: "jane@example.com",
      description: " Paint <all> units ",
      ignored: "not forwarded",
    }),
    {
      ...env,
      B9_INQUIRY_WEBHOOK_URL: "https://app.example.com/inquiries",
      B9_INQUIRY_SECRET: "webhook-secret",
    },
    undefined,
    fetcher
  );

  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].init.headers.Authorization, "Bearer test-key");
  assert.match(JSON.parse(calls[0].init.body).html, /&lt;all&gt;/);
  assert.equal(calls[1].init.headers.Authorization, "Bearer webhook-secret");
  assert.equal(JSON.parse(calls[1].init.body).name, "Jane");
  assert.equal(JSON.parse(calls[1].init.body).ignored, undefined);
});

test("returns JSON when Resend is unavailable", async () => {
  const response = await handleSubmit(
    request({ name: "Jane", email: "jane@example.com", description: "Repair" }),
    env,
    undefined,
    async () => {
      throw new Error("network unavailable");
    }
  );

  assert.equal(response.status, 500);
  assert.equal(response.headers.get("Content-Type"), "application/json; charset=utf-8");
  assert.deepEqual(await response.json(), { error: "Could not reach the email service." });
});

test("returns before optional forwarding finishes and registers its promise", { timeout: 500 }, async () => {
  let finishForwarding;
  let forwardingCompleted = false;
  const registered = [];
  const forwardingResponse = new Promise((resolve) => {
    finishForwarding = () => resolve(new Response(null, { status: 200 }));
  });
  const fetcher = async (url) => {
    if (url === "https://api.resend.com/emails") {
      return new Response(null, { status: 200 });
    }
    const response = await forwardingResponse;
    forwardingCompleted = true;
    return response;
  };

  const response = await handleSubmit(
    request({ name: "Jane", email: "jane@example.com", description: "Repair" }),
    {
      ...env,
      B9_INQUIRY_WEBHOOK_URL: "https://app.example.com/inquiries",
      B9_INQUIRY_SECRET: "webhook-secret",
    },
    { waitUntil: (promise) => registered.push(promise) },
    fetcher
  );

  assert.equal(response.status, 200);
  assert.equal(forwardingCompleted, false);
  assert.equal(registered.length, 1);

  finishForwarding();
  await registered[0];
  assert.equal(forwardingCompleted, true);
});

test("serves static assets with the existing security headers", async () => {
  const response = await worker.fetch(new Request("https://backninetrades.com/"), {
    ASSETS: {
      fetch: async () =>
        new Response("<html></html>", {
          headers: { "Content-Type": "text/html" },
        }),
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
});
