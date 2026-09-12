import { createServerFn } from "@tanstack/react-start";

// The v0/Supabase integration allow-lists a redirect proxy URL and forwards the
// OAuth/email `?code=` back to the app's /auth/callback route. Expose it to the
// client from the server, since Vite only injects a subset of env vars.
export const getAuthRedirectUrl = createServerFn({ method: "GET" }).handler(
  async () => {
    return {
      redirectUrl:
        process.env["NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"] ?? null,
    };
  },
);
