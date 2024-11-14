"use server";

import { auth } from "@/app/auth";
import { useSupabase } from "@/app/context/SupabaseContext";
import { supabase } from "@/lib/utils";
import { database } from "@/src/db/database";
import { bidAcknowledgments, bids, items, users } from "@/src/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export async function createBidAction(itemId: number) {
//   const session = await auth();

//   if (!session || !session.user || !session.user.id) {
//     throw new Error("You must be logged in");
//   }

//   const item = await database.query.items.findFirst({
//     where: eq(items.id, itemId),
//   });

//   if (!item) {
//     throw new Error("Item not found!");
//   }

//   const latestBidValue = item.currentBid
//     ? item.currentBid + item.bidInterval
//     : item.startingPrice + item.bidInterval;

//   await database.insert(bids).values({
//     amount: latestBidValue,
//     itemId,
//     userId: session.user.id,
//     timestamp: new Date(),
//   });

//   await database
//     .update(items)
//     .set({
//       currentBid: latestBidValue,
//     })
//     .where(eq(items.id, itemId));

//   // Fetch the latest bid with user information
//   const latestBid = await database.query.bids.findFirst({
//     where: eq(bids.itemId, itemId),
//     orderBy: desc(bids.id),
//     with: {
//       user: {
//         columns: {
//           image: true,
//           name: true,
//         },
//       },
//     },
//   });

//   // Send bid update to Socket.IO server via HTTP
//   try {
//     console.log("Sending bid update to Socket.IO server");
//     const response = await fetch("http://localhost:8082/api/bids", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         itemId,
//         newBid: latestBidValue,
//         bidInfo: latestBid,
//       }),
//     });

//     if (!response.ok) {
//       console.error("Failed to send bid update to Socket.IO server");
//     }

//     const result = await response.json();
//     console.log("Socket.IO server response:", result);
//   } catch (error) {
//     console.error("Error sending bid update:", error);
//   }

//   revalidatePath(`/items/${itemId}`);
// }

export async function getLatestBidWithUser(itemId: number) {
  const { data: latestBid, error: latestBidError } = await supabase
    .from('bids')
    .select("*, users (*)")
    .eq('itemId', itemId)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (latestBidError) {
    console.error("Error fetching latest bid:", latestBidError);
    return null;
  }

  return latestBid;
}
export async function createBidAction(itemId: number, userId: string) {
  // Get item
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (itemError || !item) {
    throw new Error("Item not found!");
  }

    const latestBidValue = item.currentBid
    ? item.currentBid + item.bidInterval
    : item.startingPrice + item.bidInterval;

  // Insert new bid
  const { error: bidError } = await supabase
    .from('bids')
    .insert({
      amount: latestBidValue,
      itemId: itemId,
      userId: userId,
      timestamp: new Date(),
});

  if (bidError) throw new Error("Failed to create bid");

  // Update item's current bid
  const { error: updateError } = await supabase
    .from('items')
    .update({ currentBid: latestBidValue })
    .eq('id', itemId);

  if (updateError) throw new Error("Failed to update item");

  // Fetch latest bid with user information
  const { data: latestBid, error: latestBidError } = await supabase
    .from('bids')
    .select("*, users (*)")
    .eq('itemId', itemId)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (latestBidError) {
    console.error("Error fetching latest bid:", latestBidError);
  }

  // Socket.IO update remains the same
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

export async function updateItemStatus(itemId: number, userId: string) {
  // Update the item status to "checkout" and associate with the winning user
  const { error: updateError } = await supabase
    .from('items')
    .update({ status: "CHECKOUT", winnerId: userId }) // Assuming you have a winnerId field
    .eq('id', itemId);

  if (updateError) {
    throw new Error("Failed to update item status");
  }

  // Optionally revalidate the page to reflect changes
  revalidatePath("/");

  // Redirect to the checkout page after updating the status
  redirect(`/checkout/${itemId}`);
}

export async function updateBidAcknowledgmentAction(itemId: string, userId: string) {
  const { error: insertError } = await supabase
    .from('bid_acknowledgments')
    .insert({
      userId: userId,
      itemId: itemId,
    });

  if (insertError) {
    throw new Error("Failed to update bid acknowledgment");
  }

  return { success: true };
}

export async function checkBidAcknowledgmentAction(itemId: string, userId: string | null) {
  try {
    // console.log('checkBidAcknowledgmentAction', userId, itemId);
    const query = supabase
      .from('bid_acknowledgments')
      .select('*')
      .eq('itemId', itemId)
      .limit(1);

    if (userId) {
      query.eq('userId', userId);
    }

    const { data: acknowledgment, error: selectError } = await query;

    if (selectError) {
      console.error("Supabase error:", selectError);
      throw new Error("Failed to check bid acknowledgment");
    }

    return acknowledgment.length > 0;
  } catch (error) {
    console.error("Error in checkBidAcknowledgmentAction:", error);
    throw error;
  }
}

export async function fetchItem(itemId: string) {
  const { data: item } = await supabase
    .from("items")
    .select("*, images (*)")
    .eq("id", parseInt(itemId))
    .single();
  return item;
}

export async function fetchItemUser(userId: string) {
  const { data: itemUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  return itemUser;
}

export async function fetchBids(itemId: string) {
  const { data: bids = [] } = await supabase
    .from("bids")
    .select("*, users (*)")
    .eq("itemId", itemId)
    .order("id", { ascending: false });
  return bids;
}