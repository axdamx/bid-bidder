"use server";

import { database } from "@/src/db/database";
import { items, users } from "@/src/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function getUserById(userId: string) {
  if (!userId) return null;

  return await database.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

// import { database } from "@/src/db/database";
import { cache } from "react";

export const getItemsWithUsers = cache(async () => {
  try {
    const allItems = await database.query.items.findMany();
    const itemsWithUsers = await Promise.all(
      allItems.map(async (item) => ({
        ...item,
        user: await getUserById(item.userId),
      }))
    );
    return { items: itemsWithUsers, error: null };
  } catch (error) {
    console.error("Error fetching items with users:", error);
    return { items: [], error: "Failed to fetch items" };
  }
});

export const getLiveAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  return items.filter((item) => new Date(item.endDate) > new Date());
});

export const getEndedAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  return items.filter((item) => new Date(item.endDate) < new Date());
});

export const getUpcomingAuctions = cache(async (limit: number = 2) => {
  const { items } = await getItemsWithUsers();
  return items.slice(0, limit);
});


export async function searchItems(query: string) {
  if (!query) {
    return [];
  }

  try {
    const searchResults = await database.query.items.findMany({
      where: ilike(items.name, `%${query}%`),
      limit: 5,
      columns: {
        id: true,
        name: true,
        imageId: true,
        currentBid: true,
      },
    });

    return searchResults.map(item => ({
      id: item.id.toString(), // Convert to string since id is serial
      name: item.name,
      imageUrl: item.imageId, // You might want to transform this to a full URL if needed
      currentBid: item.currentBid
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}