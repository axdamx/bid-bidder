"use server";

import { createServerSupabase } from "@/lib/supabase/server";

interface CreateReviewParams {
  orderId: number;
  sellerId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
}

export async function createReview({
  orderId,
  sellerId,
  reviewerId,
  rating,
  comment,
}: CreateReviewParams) {
  const supabase = createServerSupabase();

  try {
    // Simple check to ensure the reviewer is authenticated
    if (!reviewerId) {
      throw new Error("You must be logged in to submit a review");
    }

    // Check if a review already exists for this order
    const { data: existingReview, error: existingReviewError } = await supabase
      .from("reviews")
      .select("id")
      .eq("orderId", orderId)
      .maybeSingle();

    if (existingReview) {
      // Update existing review
      const { data: updatedReview, error: updateError } = await supabase
        .from("reviews")
        .update({
          rating,
          comment,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingReview.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedReview;
    } else {
      // Create new review
      const { data: newReview, error: createError } = await supabase
        .from("reviews")
        .insert({
          orderId: orderId,
          reviewerId: reviewerId,
          sellerId: sellerId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;
      return newReview;
    }
  } catch (error) {
    throw error;
  }
}

export async function getSellerReviews(sellerId: string) {
  const supabase = createServerSupabase();

  try {
    // First get all reviews for the seller
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("sellerId", sellerId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    if (!reviews || reviews.length === 0) return [];

    // Then fetch reviewer details separately
    const reviewerIds = [
      ...new Set(reviews.map((review) => review.reviewerId)),
    ];
    const { data: reviewers, error: reviewersError } = await supabase
      .from("users")
      .select("id, name, email, image")
      .in("id", reviewerIds);

    if (reviewersError) throw reviewersError;

    // Fetch order details separately
    const orderIds = [...new Set(reviews.map((review) => review.orderId))];
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, itemId")
      .in("id", orderIds);

    if (ordersError) throw ordersError;

    // Fetch item details separately
    const itemIds = [...new Set(orders.map((order) => order.itemId))];
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name, imageId")
      .in("id", itemIds);

    if (itemsError) throw itemsError;

    // Combine all the data
    const enrichedReviews = reviews.map((review) => {
      const reviewer = reviewers?.find((r) => r.id === review.reviewerId);
      const order = orders?.find((o) => o.id === review.orderId);
      const item = order ? items?.find((i) => i.id === order.itemId) : null;

      return {
        ...review,
        reviewer,
        order: order
          ? {
              ...order,
              item,
            }
          : null,
      };
    });

    return enrichedReviews;
  } catch (error) {
    throw error;
  }
}

export async function getUserReviews(userId: string) {
  const supabase = createServerSupabase();

  try {
    // First get all reviews by the user
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("reviewerId", userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    if (!reviews || reviews.length === 0) return [];

    // Then fetch seller details separately
    const sellerIds = [...new Set(reviews.map((review) => review.sellerId))];
    const { data: sellers, error: sellersError } = await supabase
      .from("users")
      .select("id, name, email, image")
      .in("id", sellerIds);

    if (sellersError) throw sellersError;

    // Fetch order details separately
    const orderIds = [...new Set(reviews.map((review) => review.orderId))];
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, itemId")
      .in("id", orderIds);

    if (ordersError) throw ordersError;

    // Fetch item details separately
    const itemIds = [...new Set(orders.map((order) => order.itemId))];
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name, imageId")
      .in("id", itemIds);

    if (itemsError) throw itemsError;

    // Combine all the data
    const enrichedReviews = reviews.map((review) => {
      const seller = sellers?.find((s) => s.id === review.sellerId);
      const order = orders?.find((o) => o.id === review.orderId);
      const item = order ? items?.find((i) => i.id === order.itemId) : null;

      return {
        ...review,
        seller,
        order: order
          ? {
              ...order,
              item,
            }
          : null,
      };
    });

    return enrichedReviews;
  } catch (error) {
    throw error;
  }
}

export async function getSellerRatingSummary(sellerId: string) {
  const supabase = createServerSupabase();

  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("sellerId", sellerId);

    if (error) throw error;

    if (!reviews.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    // Calculate average rating
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = sum / reviews.length;

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  } catch (error) {
    throw error;
  }
}
