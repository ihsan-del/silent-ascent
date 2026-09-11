import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/profiles.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Peak Academia — Dashboard" },
      { name: "description", content: "Your Peak Academia dashboard." },
    ],
  }),
});

function Dashboard() {
  const router = useRouter();
  const ensureProfileFn = useServerFn(ensureProfile);

  useEffect(() => {
    ensureProfileFn({ data: {} }).catch(console.error);
  }, [ensureProfileFn]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1
        className="text-4xl font-normal text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Welcome to Peak Academia
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        You're signed in. This is your dashboard — more features will appear here soon.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Back to home
        </Link>
        <button
          onClick={handleSignOut}
          className="inline-flex h-11 items-center justify-center rounded-full bg-amber px-6 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
