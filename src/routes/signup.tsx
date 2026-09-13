import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ensureProfile } from "@/lib/profiles.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — Peak Academia" },
      {
        name: "description",
        content:
          "Create your Peak Academia account and begin a structured year of Matric or O Level preparation.",
      },
      { property: "og:title", content: "Sign Up — Peak Academia" },
      {
        property: "og:description",
        content:
          "Create your Peak Academia account and begin a structured year of Matric or O Level preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const ensureProfileFn = useServerFn(ensureProfile);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName.trim() },
        },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        await ensureProfileFn();
        navigate({ to: "/dashboard", search: {} });
      } else {
        setMessage("Check your email to confirm your account, then log in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="starfield relative flex min-h-screen flex-col items-center justify-center bg-auth-panel px-6 py-16">
      <div className="relative z-10 w-full max-w-md">
        <div
          className="mb-8 text-center text-2xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Peak Academia
        </div>

        <div className="rounded-2xl border border-border/40 bg-auth-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <h1
            className="text-center text-3xl font-normal text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Begin Your Journey
          </h1>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Create your account. Enrollment details come next.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                maxLength={120}
                className="auth-input h-11 rounded-lg border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

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
                maxLength={255}
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-foreground"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="font-medium text-amber transition-colors hover:text-amber/80"
            >
              Log in
            </Link>
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
  );
}
