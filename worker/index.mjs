import { handleSubmit } from "./submit.mjs";

const SECURITY_HEADERS = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// client.back9trades.com is the old Client Portal address, printed and saved
// before the portal moved to Jobber. Every request there, whatever the path,
// goes to Back9's Jobber Client Hub sign-in.
export const CLIENT_HOST = "client.back9trades.com";
export const CLIENT_HUB_URL =
  "https://clienthub.getjobber.com/client_hubs/146c1ce2-51c9-4d35-b14c-9f14af4d49d2/login/new?source=share_login";

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

export default {
  async fetch(request, env, ctx) {
    const { hostname, pathname } = new URL(request.url);

    if (hostname === CLIENT_HOST) {
      return withSecurityHeaders(Response.redirect(CLIENT_HUB_URL, 301));
    }

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
