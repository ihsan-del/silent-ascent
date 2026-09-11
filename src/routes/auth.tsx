import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Peak Academia — Begin" },
      {
        name: "description",
        content: "Sign up or log in to Peak Academia.",
      },
      {
        property: "og:title",
        content: "Peak Academia — Begin",
      },
      {
        property: "og:description",
        content: "Sign up or log in to Peak Academia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" }) as { next?: string };
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate({ to: search.next || "/" });
      }
    };
    checkSession();
  }, [navigate, search.next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          navigate({ to: search.next || "/" });
        } else {
          setMessage("Check your email to confirm your account.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate({ to: search.next || "/" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signup" ? "login" : "signup"));
    setError(null);
    setMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-auth-panel md:flex-row">
      {/* Quote panel — desktop left, mobile top */}
      <div className="starfield relative flex flex-col items-center justify-center px-8 py-10 md:w-1/2 md:px-16 md:py-0">
        <div className="relative z-10 max-w-md text-center md:text-left">
          <blockquote
            className="text-2xl font-normal leading-snug text-foreground md:text-4xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            "Discipline is the bridge between intention and mastery."
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            Begin with clarity. Continue with purpose.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:w-1/2 md:px-12">
        <div className="w-full max-w-sm">
          <div
            className="mb-10 text-center text-2xl tracking-tight text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Peak Academia
          </div>

          <div className="rounded-2xl border border-border/40 bg-auth-card p-8 shadow-2xl">
            <h1 className="text-center text-xl font-medium text-foreground">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {mode === "signup"
                ? "Start your journey with Peak Academia."
                : "Sign in to continue where you left off."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm text-foreground">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="auth-input h-11 rounded-lg border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="auth-input h-11 rounded-lg border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="auth-input h-11 rounded-lg border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
              {message && (
                <p className="text-center text-sm text-amber">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-full bg-amber px-6 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "signup" ? (
                  "Sign up"
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-amber transition-colors hover:text-amber/80"
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
