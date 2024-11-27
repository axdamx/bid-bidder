// app/actions/user.ts
"use server";

import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
import { auth } from "../auth";

export const getUserData = async () => {
  const supabase = createServerSupabase();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "Failed to fetch user data" };
  }
};
