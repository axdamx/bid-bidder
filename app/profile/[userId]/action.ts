"use server";
import { getUserById } from "@/app/action";
import { createClientSupabase } from "@/lib/supabase/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabase } from "@/lib/utils";
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

// Follow actions
export async function followUser(followerId: string, followingId: string) {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    console.log("🚀 ~ followUser ~ followerId:", followerId);
    console.log("🚀 ~ followUser ~ followingId:", followingId);
    const { error } = await supabase
      .from("follows")
      .insert([{ followerId, followingId }]);

    if (error) throw error;

    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    console.error("Error following user:", error);
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

    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    console.error("Error unfollowing user:", error);
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
    console.error("Error fetching follow status:", error);
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
    console.error("Error fetching follow counts:", error);
    return { followersCount: 0, followingCount: 0, error };
  }
}

// Notification actions
export async function getFollowersForNotification(
  authorId: string
): Promise<NotificationFollower[]> {
  try {
    // const supabase = createClientSupabase();
    // const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("follows")
      .select("users(id, email, name)")
      .eq("followingId", authorId)
      .innerJoin("users", "users.id", "follows.followerId");

    if (error) throw error;

    return data.map((follower) => ({
      id: follower.users.id,
      email: follower.users.email ?? "",
      name: follower.users.name,
    }));
  } catch (error) {
    console.error("Error fetching followers for notification:", error);
    return [];
  }
}

// Create item with notification
export async function createItemWithNotification(
  userId: string,
  data: CreateItemData
) {
  try {
    // const supabase = createClientSupabase();
    // 1. Create the item
    // const supabase = createServerSupabase();
    const { data: newItem, error: itemError } = await supabase
      .from("items")
      .insert([
        {
          userId,
          name: data.name,
          startingPrice: data.startingPrice,
          currentBid: 0,
          bidInterval: data.bidInterval,
          endDate: data.endDate,
          description: data.description,
          imageId: data.imageId,
          status: "active",
        },
      ])
      .single();

    if (itemError) throw itemError;

    // 2. Get all followers
    const followers = await getFollowersForNotification(userId);

    // 3. Send email notifications (implement your email service)
    await notifyFollowers({
      followers,
      item: newItem,
      authorId: userId,
    });

    revalidatePath("/items");
    revalidatePath(`/profile/${userId}`);

    return { success: true, item: newItem };
  } catch (error) {
    console.error("Error in createItemWithNotification:", error);
    return { success: false, error };
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
    console.error(`Error fetching items for user ${userId}:`, error);
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
    console.error("Error fetching user:", error);
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
