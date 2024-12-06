"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function getActiveBids() {
  const supabase = createServerSupabase();

  try {
    // First get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    // Get all items where the user has placed a bid
    const { data: items, error } = await supabase
      .from("items")
      .select(
        `
        *,
        user:users(*),
        bids!inner(*)
      `
      )
      .eq("bids.userId", user.id)
      .gt("endDate", new Date().toISOString()) // Only show items that haven't ended yet
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching user's bidded items:", error);
      return [];
    }

    return items;
  } catch (error) {
    console.error("Unexpected error fetching user's bidded items:", error);
    return [];
  }
}
