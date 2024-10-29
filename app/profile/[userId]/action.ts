"use server";
import { getUserById } from "@/app/action";
import { database } from "@/src/db/database";
import { follows, items, users } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
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
    await database.insert(follows).values({
      followerId,
      followingId,
    });
    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    await database
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );
    revalidatePath(`/profile/${followingId}`);
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
    const result = await database
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );
    return { isFollowing: result.length > 0 };
  } catch (error) {
    return { isFollowing: false, error };
  }
}

export async function getFollowCounts(userId: string) {
  try {
    const followers = await database
      .select()
      .from(follows)
      .where(eq(follows.followingId, userId));

    const following = await database
      .select()
      .from(follows)
      .where(eq(follows.followerId, userId));

    return {
      followersCount: followers.length,
      followingCount: following.length,
    };
  } catch (error) {
    return { followersCount: 0, followingCount: 0, error };
  }
}

// Notification actions
export async function getFollowersForNotification(
  authorId: string
): Promise<NotificationFollower[]> {
  try {
    const followers = await database
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(follows)
      .innerJoin(users, eq(users.id, follows.followerId))
      .where(eq(follows.followingId, authorId));

    return followers.map((follower) => ({
      id: follower.id,
      email: follower.email ?? "", // Use the nullish coalescing operator to provide a default value for email
      name: follower.name,
    }));
  } catch (error) {
    console.error("Error fetching followers for notification:", error);
    return [];
  }
}

// Create item with notification
interface CreateItemData {
  name: string;
  startingPrice: number;
  bidInterval: number;
  endDate: Date;
  description?: string;
  imageId?: string;
}

export async function createItemWithNotification(
  userId: string,
  data: CreateItemData
) {
  try {
    // 1. Create the item
    const [newItem] = await database
      .insert(items)
      .values({
        userId,
        name: data.name,
        startingPrice: data.startingPrice,
        currentBid: 0,
        bidInterval: data.bidInterval,
        endDate: data.endDate,
        description: data.description,
        imageId: data.imageId,
        status: "active",
      })
      .returning();

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

async function notifyFollowers({
  followers,
  item,
  authorId,
}: {
  followers: NotificationFollower[];
  item: any; // Replace with your item type
  authorId: string;
}) {
  // Implement your email service here
  // Example with resend:
  // const resend = new Resend('re_123456789');

  try {
    // Get author name
    const [author] = await database
      .select({
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, authorId));

    for (const follower of followers) {
      // Example email structure
      const emailContent = {
        to: follower.email,
        subject: `New Auction Item: ${item.name}`,
        content: `
          Hi ${follower.name},
          
          ${author.name} just listed a new item for auction!
          
          Item: ${item.name}
          Starting Price: $${item.startingPrice}
          Ends: ${new Date(item.endDate).toLocaleDateString()}
          
          Don't miss out on this exciting auction!
        `,
      };

      // Send email using your service
      // await resend.emails.send({
      //   from: "Auction Site <noreply@yourdomain.com>",
      //   to: emailContent.to,
      //   subject: emailContent.subject,
      //   text: emailContent.content
      // });

      console.log("Would send email:", emailContent);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
}

export const getItemsByUserId = cache(async (userId: string) => {
  try {
    // Query items filtering by userId
    const userItems = await database.query.items.findMany({
      where: eq(items.userId, userId),
    });

    // Fetch user details for these items
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
