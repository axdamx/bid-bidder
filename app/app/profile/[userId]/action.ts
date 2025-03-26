"use server";
import { getUserById } from "@/app/action";
import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
// import { getUserById } from "@/app/action";
// import { database } from "@/src/db/database";
// import { follows, items, users } from "@/src/db/schema";
// import { and, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { cache } from "react";

// import { supabase } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export type NotificationFollower = {
  id: string;
  email: string;
  name: string | null;
};

const supabase = createServerSupabase();

// Follow actions
export async function followUser(followerId: string, followingId: string) {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { error } = await supabase
      .from("follows")
      .insert([{ followerId, followingId }]);

    if (error) throw error;

    revalidatePath(`/app/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ followerId, followingId });

    if (error) throw error;

    revalidatePath(`/app/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getFollowStatus(
  followerId: string | null,
  followingId: string
) {
  if (!followerId) return { isFollowing: false };

  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .match({ followerId, followingId });

    if (error) throw error;

    return { isFollowing: data.length > 0 };
  } catch (error) {
    return { isFollowing: false, error };
  }
}

export async function getFollowCounts(userId: string) {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { data: followers, error: followersError } = await supabase
      .from("follows")
      .select("*")
      .eq("followingId", userId);

    const { data: following, error: followingError } = await supabase
      .from("follows")
      .select("*")
      .eq("followerId", userId);

    if (followersError || followingError)
      throw followersError || followingError;

    return {
      followersCount: followers.length,
      followingCount: following.length,
    };
  } catch (error) {
    return { followersCount: 0, followingCount: 0, error };
  }
}

export const getItemsByUserId = cache(async (userId: string) => {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { data: userItems, error } = await supabase
      .from("items")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false }); // Sort by latest createdAt

    if (error) throw error;

    const itemsWithUser = await Promise.all(
      userItems.map(async (item) => ({
        ...item,
        user: await getUserById(item.userId),
      }))
    );

    return { ownedItems: itemsWithUser, error: null };
  } catch (error) {
    return {
      ownedItems: [],
      error: `Failed to fetch items for user ${userId}`,
    };
  }
});

export async function fetchUser(userId: string) {
  // const supabase = createClientSupabase();
  // const supabase = createServerSupabase();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }

  return user;
}

export async function fetchFollowData(currentUserId: string, userId: string) {
  const { isFollowing } = await getFollowStatus(currentUserId, userId);
  const { followersCount, followingCount } = await getFollowCounts(userId);

  return { isFollowing, followersCount, followingCount };
}

export async function fetchOwnedItems(userId: string) {
  const { ownedItems } = await getItemsByUserId(userId);
  return ownedItems;
}
