import { createFileRoute, Link, useRouter, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/profiles.functions";
import { getMyEnrollment } from "@/lib/enrollments.functions";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  validateSearch: (search: Record<string, unknown>) => ({
    enrolled: search['enrolled'] === true || search['enrolled'] === "true",
  }),
  head: () => ({
    meta: [
      { title: "Peak Academia — Dashboard" },
      { name: "description", content: "Your Peak Academia dashboard." },
    ],
  }),
});

function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enrolled } = useSearch({ from: "/_authenticated/dashboard" });
  const ensureProfileFn = useServerFn(ensureProfile);
  const fetchEnrollment = useServerFn(getMyEnrollment);

  useEffect(() => {
    ensureProfileFn().catch(console.error);
  }, [ensureProfileFn]);

  const { data: enrollment, isLoading } = useQuery({
    queryKey: ["enrollment"],
    queryFn: () => fetchEnrollment(),
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="starfield relative min-h-screen bg-auth-panel px-6 py-16">
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <h1
          className="text-center text-4xl font-normal text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Welcome to Peak Academia
        </h1>

        {enrolled && enrollment && (
          <p className="mt-4 rounded-xl border border-amber/40 bg-amber/10 px-5 py-3 text-center text-sm text-amber">
            Enrollment submitted successfully. We'll be in touch soon.
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-border/40 bg-auth-card/80 p-8 shadow-2xl backdrop-blur-xl">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : enrollment ? (
            <div>
              <h2
                className="text-2xl font-normal text-foreground"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Your Enrollment
              </h2>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Student</dt>
                  <dd className="text-foreground">{enrollment.full_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Guardian</dt>
                  <dd className="text-foreground">{enrollment.guardian_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Board</dt>
                  <dd className="text-foreground">{enrollment.board}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Class</dt>
                  <dd className="text-foreground">{enrollment.class_level}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Institution</dt>
                  <dd className="text-foreground">{enrollment.institution}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">City</dt>
                  <dd className="text-foreground">{enrollment.city}</dd>
                </div>
              </dl>

              <h3 className="mt-8 text-sm uppercase tracking-widest text-muted-foreground">
                Subjects
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {enrollment.subjects.map((subject: string) => (
                  <span
                    key={subject}
                    className="rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-sm text-foreground"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2
                className="text-2xl font-normal text-foreground"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Complete Your Enrollment
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                You haven't filled the enrollment form yet. It takes two short
                steps — your details, then your subjects.
              </p>
              <Link
                to="/enroll"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-amber px-8 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02]"
              >
                Start enrollment
              </Link>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Back to home
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
