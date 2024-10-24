import { database } from "@/src/db/database";
import { items } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

// Function to get items for checkout
export async function getCheckoutItems(userId: string) {
  const item = await database.query.items.findFirst({
    where: and(
      //   eq(items.id, parseInt(itemId)),      // Check if the item ID matches
      eq(items.winnerId, userId), // Crosscheck if the user is the winner
      eq(items.status, "checkout") // Check if the item is in "checkout" status
    ),
  });

  return item;
}
