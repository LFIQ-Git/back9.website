import { handleSubmit } from "./submit.mjs";

const SECURITY_HEADERS = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/submit") {
      return withSecurityHeaders(await handleSubmit(request, env, ctx));
    }
    if (pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        Response.json({ error: "Not found" }, { status: 404 })
      );
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
