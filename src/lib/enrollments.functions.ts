import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const BOARDS = [
  "Cambridge (O-Levels)",
  "Federal Board",
  "Sindh Board",
] as const;

export const CLASSES = ["O-Level 1", "O-Level 2", "9th", "Matric"] as const;

export const SUBJECTS_BY_BOARD: Record<string, string[]> = {
  "Cambridge (O-Levels)": [
    "Pakistan Studies",
    "Physics",
    "Islamiyat",
    "English",
    "Maths",
    "Chemistry",
    "Biology",
    "Accounting",
    "Business Studies",
    "Economics",
    "Sociology",
    "Urdu",
  ],
  "Federal Board": [
    "English",
    "Urdu",
    "Islamic Education",
    "Pakistan Studies",
    "Islamic History",
    "Biology",
    "Physics",
    "Chemistry",
  ],
  "Sindh Board": [
    "Urdu",
    "Islamiyat",
    "English",
    "Physics",
    "Biology",
    "Pakistan Studies",
    "Sindhi",
    "Maths",
    "Chemistry",
  ],
};

const enrollmentSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  guardianName: z.string().trim().min(1).max(120),
  board: z.enum(BOARDS),
  classLevel: z.enum(CLASSES),
  contactNumber: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255),
  city: z.string().trim().min(1).max(80),
  institution: z.string().trim().min(1).max(160),
  subjects: z.array(z.string().trim().min(1).max(60)).min(1).max(20),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

export const getMyEnrollment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("enrollments")
      .select(
        "id, full_name, guardian_name, board, class_level, contact_number, email, city, institution, subjects, created_at",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  });

export const submitEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => enrollmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("enrollments").insert({
      user_id: context.userId,
      full_name: data.fullName,
      guardian_name: data.guardianName,
      board: data.board,
      class_level: data.classLevel,
      contact_number: data.contactNumber,
      email: data.email,
      city: data.city,
      institution: data.institution,
      subjects: data.subjects,
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });
