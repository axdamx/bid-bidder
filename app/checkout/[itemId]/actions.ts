"use server";
// import { supabase } from "@/lib/utils";
import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
// import { database } from "@/src/db/database";
// import { items } from "@/src/db/schema";
// import { and, eq } from "drizzle-orm";

// Function to get items for checkout
export async function getCheckoutItems(userId: string, itemId: string) {
  const supabase = createServerSupabase();

  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("itemId", parseInt(itemId))
      .eq("buyerId", userId)
      .eq("orderStatus", "pending")
      .single();

    // Then get the item details
    const { data: itemDetails } = await supabase
      .from("items")
      .select("*")
      .eq("id", parseInt(itemId))
      .single();

    // Return both order and item details
    return {
      order,
      item: itemDetails,
    };
  } catch (error) {
    console.error("Error fetching checkout item:", error);
    return null;
  }
}
