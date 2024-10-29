"use server";

import { database } from "@/src/db/database";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId) {
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
