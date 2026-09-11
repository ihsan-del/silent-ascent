import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return { created: false, profileId: existing.id };
    }

    const fullName =
      context.claims?.user_metadata?.full_name ||
      context.claims?.user_metadata?.name ||
      "";

    const { data: inserted, error } = await supabase
      .from("profiles")
      .insert({ user_id: userId, full_name: fullName })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { created: true, profileId: inserted.id };
  });
