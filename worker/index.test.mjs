import assert from "node:assert/strict";
import test from "node:test";

import worker, { CLIENT_HUB_URL } from "./index.mjs";

const env = { ASSETS: { fetch: async () => new Response("site") } };

test("client.back9trades.com sends every path to the Jobber Client Hub", async () => {
  for (const path of ["/", "/login", "/anything?x=1"]) {
    const res = await worker.fetch(new Request(`https://client.back9trades.com${path}`), env, {});
    assert.equal(res.status, 301);
    assert.equal(res.headers.get("location"), CLIENT_HUB_URL);
  }
});

test("the main site still serves its pages", async () => {
  const res = await worker.fetch(new Request("https://back9trades.com/"), env, {});
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "site");
});
