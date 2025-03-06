"use server";

// import { auth } from "@/app/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { captureEvent } from "@/lib/posthog";
// import { supabase } from "@/lib/utils";
// import { database } from "@/src/db/database";
// import { bidAcknowledgments, bids, items, users } from "@/src/db/schema";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
const supabase = createServerSupabase();

export async function getLatestBidWithUser(itemId: number) {
  const { data: latestBid, error: latestBidError } = await supabase
    .from("bids")
    .select("*, users (*)")
    .eq("itemId", itemId)
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (latestBidError) {
    console.error("Error fetching latest bid:", latestBidError);
    return null;
  }

  return latestBid;
}

export async function createBidAction(
  itemId: number,
  userId: string,
  isBuyItNow: boolean = false,
  currentItemData?: {
    currentBid: number;
    startingPrice: number;
    bidInterval: number;
    binPrice: number;
  }
) {
  let bidAmount: number;

  if (currentItemData) {
    // Calculate bid amount using provided data
    bidAmount = isBuyItNow
      ? currentItemData.binPrice
      : currentItemData.currentBid
      ? currentItemData.currentBid + currentItemData.bidInterval
      : currentItemData.startingPrice + currentItemData.bidInterval;
  } else {
    // Fallback to fetching item data if not provided
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      throw new Error("Item not found!");
    }

    bidAmount = isBuyItNow
      ? item.binPrice
      : item.currentBid
      ? item.currentBid + item.bidInterval
      : item.startingPrice + item.bidInterval;
  }

  // Insert new bid
  const { error: bidError } = await supabase.from("bids").insert({
    amount: bidAmount,
    itemId: itemId,
    userId: userId,
    timestamp: new Date(),
  });

  if (!bidError) {
    // Track successful bid
    captureEvent(isBuyItNow ? "bin_placed" : "bid_placed", {
      itemId,
      userId,
      amount: bidAmount,
    });
  }

  if (bidError) {
    console.error("Bid Error Details:", bidError);
    throw new Error(`Failed to create bid: ${bidError.message}`);
  }

  // Update item's current bid and bought out status if it's BIN
  const { error: updateError } = await supabase
    .from("items")
    .update({
      currentBid: bidAmount,
      ...(isBuyItNow
        ? { isBoughtOut: true, status: "PENDING", winnerId: userId }
        : {}),
    })
    .eq("id", itemId);

  if (updateError) throw new Error("Failed to update item");

  // revalidatePath(`/items/${itemId}`);
}

export async function updateItemStatus(itemId: number, userId: string) {
  // Update the item status to "pending" and associate with the winning user
  const { error: updateError } = await supabase
    .from("items")
    .update({ status: "PENDING", winnerId: userId })
    .eq("id", itemId);

  if (updateError) {
    throw new Error("Failed to update item status");
  }

  // Revalidate the page to reflect changes
  revalidatePath("/");

  // Return the itemId instead of redirecting
  return { itemId };
}

export async function updateBINItemStatus(itemId: number, userId: string) {
  // Update the item status to "pending" and associate with the winning user
  const { error: updateError } = await supabase
    .from("items")
    .update({ status: "PENDING", winnerId: userId, isBoughtOut: true })
    .eq("id", itemId);

  if (updateError) {
    throw new Error("Failed to update item status");
  }

  // Revalidate the page to reflect changes
  revalidatePath("/");

  // Return the itemId instead of redirecting
  return { itemId };
}

export async function updateBidAcknowledgmentAction(
  itemId: number,
  userId: string
) {
  const { error: insertError } = await supabase
    .from("bid_acknowledgments")
    .insert({
      userId: userId,
      itemId: itemId,
    });

  if (insertError) {
    throw new Error("Failed to update bid acknowledgment");
  }

  return { success: true };
}

export async function checkBidAcknowledgmentAction(
  itemId: string,
  userId: string | null
) {
  try {
    // console.log('checkBidAcknowledgmentAction', userId, itemId);
    const query = supabase
      .from("bid_acknowledgments")
      .select("*")
      .eq("itemId", itemId)
      .limit(1);

    if (userId) {
      query.eq("userId", userId);
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
  // First fetch the item with user details
  const { data: item, error } = await supabase
    .from("items")
    .select("*, images (*), users!items_userId_fkey (*)") // Added users relation
    .eq("id", parseInt(itemId))
    .single();

  if (error) {
    console.error("Error fetching item:", error);
    return null;
  }

  if (!item || !item.users) {
    return item;
  }

  // Then fetch the seller's review summary
  const sellerId = item.users.id;
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("sellerId", sellerId);

  if (reviewsError) {
    console.error("Error fetching seller reviews:", reviewsError);
    return item;
  }

  // Calculate the review summary
  const totalReviews = reviews ? reviews.length : 0;
  let averageRating = 0;
  
  if (totalReviews > 0) {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    averageRating = sum / totalReviews;
  }

  // Add the review summary to the user object
  return {
    ...item,
    users: {
      ...item.users,
      reviewSummary: {
        averageRating,
        totalReviews
      }
    }
  };
}

// export async function fetchItemUser(userId: string) {
//   const { data: itemUser } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", userId)
//     .single();
//   return itemUser;
// }

export async function fetchBids(itemId: string) {
  const { data: bids = [] } = await supabase
    .from("bids")
    .select("*, users (*)")
    .eq("itemId", itemId)
    .order("id", { ascending: false });
  return bids;
}

// Add this check function
export async function checkExistingOrder(itemId: number, buyerId: string) {
  // const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("itemId", itemId)
    .eq("buyerId", buyerId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the "no rows returned" error
    throw error;
  }

  return !!data;
}

export async function getOrder(itemId: number, buyerId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("itemId", itemId)
    .eq("buyerId", buyerId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return order;
}

export async function createOrderAction(
  itemId: number,
  userId: string,
  finalBidAmount: number,
  sellerId: string
) {
  // const supabase = createServerSupabaseClient();

  // First check if order already exists
  const orderExists = await checkExistingOrder(itemId, userId);
  if (orderExists) {
    return null; // Order already exists, no need to create a new one
  }

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        id: `RN-${new Date()
          .toLocaleDateString("en-GB")
          .split("/")
          .join("")}-${Math.floor(10000 + Math.random() * 90000)}`,
        itemId,
        buyerId: userId,
        sellerId,
        amount: finalBidAmount,
        orderStatus: "pending",
        orderDate: new Date().toISOString(),
        paymentStatus: "unpaid",
        shippingStatus: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    // Update the item's isBoughtOut status
    const { error: updateError } = await supabase
      .from("items")
      .update({
        // isBoughtOut: true,
        status: "PENDING",
        winnerId: userId,
      })
      .eq("id", itemId);

    if (updateError) throw updateError;

    // revalidatePath(`/items/${itemId}`);

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
