"use server";

import { auth } from "@/app/auth";
import { database } from "@/src/db/database";
import { bids, items } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { io } from "../../../websocket";

export async function createBidAction(itemId: number) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    throw new Error("You must be logged in");
  }

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  const latestBidValue = item.currentBid
    ? item.currentBid + item.bidInterval
    : item.startingPrice + item.bidInterval;

  await database.insert(bids).values({
    amount: latestBidValue,
    itemId,
    userId: session.user.id,
    timestamp: new Date(),
  });

  await database
    .update(items)
    .set({
      currentBid: latestBidValue,
    })
    .where(eq(items.id, itemId));

  // Fetch the latest bid with user information
  const latestBid = await database.query.bids.findFirst({
    where: eq(bids.itemId, itemId),
    orderBy: desc(bids.id),
    with: {
      user: {
        columns: {
          image: true,
          name: true,
        },
      },
    },
  });

  // Send bid update to Socket.IO server via HTTP
  try {
    console.log("Sending bid update to Socket.IO server");
    const response = await fetch("http://localhost:8082/api/bids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId,
        newBid: latestBidValue,
        bidInfo: latestBid,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send bid update to Socket.IO server");
    }

    const result = await response.json();
    console.log("Socket.IO server response:", result);
  } catch (error) {
    console.error("Error sending bid update:", error);
  }

  revalidatePath(`/items/${itemId}`);
}
