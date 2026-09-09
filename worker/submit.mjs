const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};
const MAX_BODY_BYTES = 64 * 1024;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePayload(input) {
  const kind = input.kind === "proposal" ? "proposal" : "workorder";

  return {
    kind,
    website: text(input.website, 200),
    name: text(input.name, 200),
    company: text(input.company, 300),
    email: text(input.email, 320),
    phone: text(input.phone, 100),
    property: text(input.property, 500),
    priority: text(input.priority, 100),
    trade: text(input.trade, 200),
    requestType: text(input.requestType, 200),
    units: text(input.units, 200),
    description: text(input.description, 10_000),
  };
}

function buildEmail(payload) {
  let subject;
  let rows;

  if (payload.kind === "workorder") {
    subject = `Work Order: ${payload.property || "unspecified"} [${payload.priority || "Routine"}]`;
    rows = [
      ["Name", payload.name],
      ["Company / portfolio", payload.company],
      ["Email", payload.email],
      ["Phone", payload.phone],
      ["Property / Unit", payload.property],
      ["Priority", payload.priority],
      ["Trade", payload.trade],
      ["Issue", payload.description],
    ];
  } else {
    subject = `Proposal Request: ${payload.requestType || "general"} (${payload.company || payload.name || "unknown"})`;
    rows = [
      ["Name", payload.name],
      ["Company / portfolio", payload.company],
      ["Email", payload.email],
      ["Phone", payload.phone],
      ["Request type", payload.requestType],
      ["Units / properties", payload.units],
      ["Scope", payload.description],
    ];
  }

  const populatedRows = rows.filter(([, value]) => value);
  const plainText = populatedRows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html =
    `<h2 style="font-family:Arial,sans-serif;color:#0b2545;margin:0 0 12px;">${esc(subject)}</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse;">` +
    populatedRows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#5a6473;vertical-align:top;white-space:nowrap;">` +
          `<strong>${esc(label)}</strong></td>` +
          `<td style="padding:4px 0;color:#1a1a1a;white-space:pre-wrap;">${esc(value)}</td></tr>`
      )
      .join("") +
    `</table>`;

  return { subject, text: plainText, html };
}

async function readPayload(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: json({ error: "Request is too large." }, 413) };
  }

  const reader = request.body?.getReader();
  const chunks = [];
  let bodyLength = 0;

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    bodyLength += value.byteLength;
    if (bodyLength > MAX_BODY_BYTES) {
      await reader.cancel();
      return { error: json({ error: "Request is too large." }, 413) };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(bodyLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const rawBody = new TextDecoder().decode(body);

  try {
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { error: json({ error: "Invalid request." }, 400) };
    }
    return { payload: normalizePayload(parsed) };
  } catch {
    return { error: json({ error: "Invalid request." }, 400) };
  }
}

async function forwardToApp(payload, env, fetcher) {
  if (!env.B9_INQUIRY_WEBHOOK_URL || !env.B9_INQUIRY_SECRET) return;

  try {
    const response = await fetcher(env.B9_INQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.B9_INQUIRY_SECRET}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("Inquiry webhook rejected request:", response.status);
    }
  } catch (error) {
    console.error("Inquiry webhook failed:", error instanceof Error ? error.message : error);
  }
}

export async function handleSubmit(request, env, executionContext, fetcher = fetch) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
  }

  if (!env.RESEND_API_KEY) {
    return json(
      { error: "Email is not configured yet. Please email info@back9trades.com." },
      500
    );
  }

  const { payload, error } = await readPayload(request);
  if (error) return error;

  if (payload.website) {
    return json({ ok: true });
  }
  if (!payload.name || !payload.email || !payload.description) {
    return json({ error: "Missing name, email, or description." }, 400);
  }
  if (!EMAIL_PATTERN.test(payload.email)) {
    return json({ error: "That email address looks invalid." }, 400);
  }

  const email = buildEmail(payload);
  let response;
  try {
    response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.LEAD_FROM || "Back9 Trades Portal <onboarding@resend.dev>",
        to: [env.LEAD_INBOX || "info@back9trades.com"],
        reply_to: payload.email,
        ...email,
      }),
    });
  } catch (error) {
    console.error("Resend request failed:", error instanceof Error ? error.message : error);
    return json({ error: "Could not reach the email service." }, 500);
  }

  if (!response.ok) {
    console.error("Resend rejected request:", response.status);
    return json({ error: "Email service rejected the request." }, 502);
  }

  const forwarding = forwardToApp(payload, env, fetcher);
  if (executionContext?.waitUntil) {
    executionContext.waitUntil(forwarding);
  } else {
    await forwarding;
  }
  return json({ ok: true });
}
