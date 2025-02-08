"use server";

import { cache } from "react";
// import { signIn, signOut } from "./auth";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
// import { supabase } from "@/lib/utils";

export async function getUserById(userId: string) {
  if (!userId) return null;

  const supabase = createServerSupabase(); // Create client inside function

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
    revalidatePath("/dashboard");
    return user;
  } catch (error) {
    console.error("Unexpected error fetching user by ID:", error);
    return null;
  }
}

export const getItemsWithUsers = cache(async () => {
  const supabase = createServerSupabase(); // Create client inside function

  try {
    // Verify supabase connection
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { items: [], error: "Database connection failed" };
    }

    const { data: itemsWithUsers, error } = await supabase
      .from("items")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .throwOnError(); // Add explicit error throwing

    if (error) {
      console.error("Error fetching items with users:", error);
      return { items: [], error: error.message };
    }

    return { items: itemsWithUsers || [], error: null };
  } catch (error) {
    console.error("Unexpected error fetching items with users:", error);
    return { items: [], error: "Database connection failed" };
  }
});

// export const
export const getLiveAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();

  return items
    .filter(
      (item) =>
        // Only show items with LIVE status and not bought out
        item.status === "LIVE" && !item.isBoughtOut
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
});

export const getEndedAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();

  return items
    .filter(
      (item) =>
        // Show items that are either ENDED or bought out
        item.status === "ENDED" || item.isBoughtOut
    )
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
});

export const getUpcomingAuctions = cache(async (limit: number = 2) => {
  const { items } = await getItemsWithUsers();

  return items
    .filter(
      (item) =>
        // Only show items with UPCOMING status
        item.status === "UPCOMING"
    )
    .sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    )
    .slice(0, limit);
});

export async function searchItems(query: string) {
  const supabase = createServerSupabase(); // Create client inside function
  if (!query) {
    return [];
  }

  try {
    const { data: searchResults, error } = await supabase
      .from("items")
      .select("id, name, imageId, currentBid")
      .ilike("name", `%${query}%`)
      .limit(5);

    if (error) {
      console.error("Search error:", error);
      return [];
    }

    return searchResults.map((item) => ({
      id: item.id.toString(), // Convert to string since id is serial
      name: item.name,
      imageUrl: item.imageId || null, // You might want to transform this to a full URL if needed
      currentBid: item.currentBid,
    }));
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}

// Sign In
export const handleSignOut = async () => {
  const supabase = createServerSupabase(); // Create client inside function

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("Sign-out successful");
    // Optionally redirect the user after sign-out
    window.location.href = "/";
  }
};

export async function updateItemStatus(itemId: number, status: string) {
  "use server";

  const supabase = createServerSupabase();

  try {
    const { error } = await supabase
      .from("items")
      .update({ status: status })
      .eq("id", itemId);

    if (error) throw error;

    // Revalidate the auctions pages
    revalidatePath("/");
    revalidatePath("/auctions");

    return { success: true };
  } catch (error) {
    console.error("Error updating item status:", error);
    return { success: false, error };
  }
}
