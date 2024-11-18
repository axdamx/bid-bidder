"use server";
// import { supabase } from "@/lib/utils";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabase } from "@/lib/utils";
import { database } from "@/src/db/database";
import { items } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

// Function to get items for checkout
export async function getCheckoutItems(userId: string, itemId: string) {
  const supabase = createServerSupabase();

  try {
    const { data: item } = await supabase
      .from("items")
      .select("*")
      .eq("id", parseInt(itemId))
      .eq("winnerId", userId)
      .eq("status", "CHECKOUT")
      .single();

    return item;
  } catch (error) {
    console.error("Error fetching checkout item:", error);
    return null;
  }
}
