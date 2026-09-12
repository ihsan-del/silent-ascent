import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/profiles.functions";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
  ssr: false,
  head: () => ({
    meta: [{ title: "Signing you in — Peak Academia" }],
  }),
});

function AuthCallback() {
  const navigate = useNavigate();
  const ensureProfileFn = useServerFn(ensureProfile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const url = new URL(window.location.href);
      const providerError =
        url.searchParams.get("error_description") ||
        url.searchParams.get("error");
      if (providerError) {
        if (active) setError(providerError);
        return;
      }

      const code = url.searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (active) setError(exchangeError.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (active) setError("We couldn't complete sign-in. Please try again.");
        return;
      }

      // Best-effort: the dashboard also ensures a profile exists.
      try {
        await ensureProfileFn();
      } catch {
        /* ignore */
      }
      if (active) navigate({ to: "/dashboard", search: { enrolled: false } });
    };

    run();
    return () => {
      active = false;
    };
  }, [navigate, ensureProfileFn]);

  return (
    <div className="starfield relative flex min-h-screen flex-col items-center justify-center bg-auth-panel px-6">
      <div className="relative z-10 w-full max-w-sm text-center">
        <div
          className="mb-8 text-2xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Peak Academia
        </div>

        {error ? (
          <div className="rounded-2xl border border-border/40 bg-auth-card/80 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-sm text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => navigate({ to: "/auth" })}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-amber px-8 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-amber" />
            <p className="text-sm">Signing you in…</p>
          </div>
        )}
      </div>
    </div>
  );
}
