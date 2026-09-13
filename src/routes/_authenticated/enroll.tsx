import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BOARDS,
  CLASSES,
  SUBJECTS_BY_BOARD,
  submitEnrollment,
} from "@/lib/enrollments.functions";

export const Route = createFileRoute("/_authenticated/enroll")({
  component: EnrollPage,
  head: () => ({
    meta: [
      { title: "Enrollment — Peak Academia" },
      {
        name: "description",
        content: "Complete your Peak Academia enrollment in two short steps.",
      },
    ],
  }),
});

const inputClass =
  "auth-input h-11 rounded-lg border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/60";

function EnrollPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submit = useServerFn(submitEnrollment);

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    guardianName: "",
    board: "" as (typeof BOARDS)[number] | "",
    classLevel: "" as (typeof CLASSES)[number] | "",
    contactNumber: "",
    email: "",
    city: "",
    institution: "",
  });
  const [subjects, setSubjects] = useState<string[]>([]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep(2);
  };

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (subjects.length === 0) {
      setError("Select at least one subject.");
      return;
    }
    setLoading(true);
    try {
      await submit({
        data: {
          fullName: form.fullName,
          guardianName: form.guardianName,
          board: form.board as (typeof BOARDS)[number],
          classLevel: form.classLevel as (typeof CLASSES)[number],
          contactNumber: form.contactNumber,
          email: form.email,
          city: form.city,
          institution: form.institution,
          subjects,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      navigate({ to: "/dashboard", search: { enrolled: true } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save your enrollment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const boardSubjects = form.board ? SUBJECTS_BY_BOARD[form.board] ?? [] : [];

  return (
    <div className="starfield relative min-h-screen bg-auth-panel px-6 py-16">
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div
          className="mb-8 text-center text-2xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Peak Academia
        </div>

        <div className="rounded-2xl border border-border/40 bg-auth-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {step} of 2</span>
              <span>{step === 1 ? "Student details" : "Subject selection"}</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full bg-amber transition-all duration-500"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          <h1
            className="text-center text-3xl font-normal text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {step === 1 ? "Your Details" : "Choose Your Subjects"}
          </h1>

          {step === 1 ? (
            <form onSubmit={handleNext} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    required
                    maxLength={120}
                    value={form.fullName}
                    onChange={(e) => set("fullName")(e.target.value)}
                    className={inputClass}
                    placeholder="Student name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Parent / Guardian name</Label>
                  <Input
                    id="guardianName"
                    required
                    maxLength={120}
                    value={form.guardianName}
                    onChange={(e) => set("guardianName")(e.target.value)}
                    className={inputClass}
                    placeholder="Guardian name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="board">Board</Label>
                <select
                  id="board"
                  required
                  value={form.board}
                  onChange={(e) => {
                    set("board")(e.target.value);
                    setSubjects([]);
                  }}
                  className={`${inputClass} w-full`}
                >
                  <option value="">Select a board</option>
                  {BOARDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classLevel">Class</Label>
                <select
                  id="classLevel"
                  required
                  value={form.classLevel}
                  onChange={(e) => set("classLevel")(e.target.value)}
                  className={`${inputClass} w-full`}
                >
                  <option value="">Select a class</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact number</Label>
                  <Input
                    id="contactNumber"
                    required
                    maxLength={30}
                    value={form.contactNumber}
                    onChange={(e) => set("contactNumber")(e.target.value)}
                    className={inputClass}
                    placeholder="03XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    maxLength={80}
                    value={form.city}
                    onChange={(e) => set("city")(e.target.value)}
                    className={inputClass}
                    placeholder="Karachi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution / School</Label>
                  <Input
                    id="institution"
                    required
                    maxLength={160}
                    value={form.institution}
                    onChange={(e) => set("institution")(e.target.value)}
                    className={inputClass}
                    placeholder="School name"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-full bg-amber px-6 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                Subjects for {form.board}. Pick as many as you need.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {boardSubjects.map((subject) => {
                  const checked = subjects.includes(subject);
                  return (
                    <label
                      key={subject}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                        checked
                          ? "border-amber/70 bg-amber/10 text-foreground"
                          : "border-border/50 bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubject(subject)}
                        className="h-4 w-4 accent-amber"
                      />
                      {subject}
                    </label>
                  );
                })}
              </div>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex h-12 flex-1 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 flex-1 items-center justify-center rounded-full bg-amber px-6 text-sm font-medium text-amber-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit Enrollment"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            search={{ enrolled: undefined }}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
