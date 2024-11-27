"use server";

import { cache } from "react";
import { signIn, signOut } from "./auth";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
// import { supabase } from "@/lib/utils";

const supabase = createServerSupabase();

export async function getUserById(userId: string) {
  // const supabase = createServerSupabase();
  if (!userId) return null;

  // const supabase = createServerSupabase(); // Create Supabase client

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
  // const supabase = createServerSupabase(); // Create Supabase client
  // const supabase = createServerSupabase();

  try {
    const { data: itemsWithUsers, error } = await supabase.from("items")
      .select(`
        *,
        user:users(*)
      `);

    if (error) {
      console.error("Error fetching items with users:", error);
      return { items: [], error: "Failed to fetch items" };
    }
    // console.log("itemsWithUsers", itemsWithUsers);

    return { items: itemsWithUsers, error: null };
  } catch (error) {
    console.error("Unexpected error fetching items with users:", error);
    return { items: [], error: "Failed to fetch items" };
  }
});

// export const
export const getLiveAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  // console.log('items', items)
  return items
    .filter((item) => new Date(item.endDate + "Z") > new Date())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
});

export const getEndedAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  return items.filter((item) => new Date(item.endDate + "Z") < new Date());
});

export const getUpcomingAuctions = cache(async (limit: number = 2) => {
  const { items } = await getItemsWithUsers();
  return items.slice(0, limit);
});
export async function searchItems(query: string) {
  // const supabase = createServerSupabase();
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
export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutWithGoogle() {
  await signOut({ redirectTo: "/" });
}

export const handleSignOut = async () => {
  // const supabase = createClientSupabase(); // Use client-side Supabase
  // const supabase = createServerSupabase();
  // const supabase = createServerSupabase();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("Sign-out successful");
    // Optionally redirect the user after sign-out
    window.location.href = "/";
  }
};
