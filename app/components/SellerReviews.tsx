"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSellerReviews,
  getSellerRatingSummary,
} from "../dashboard/reviews/action";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "./OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface SellerReviewsProps {
  sellerId: string;
}

export function SellerReviews({ sellerId }: SellerReviewsProps) {
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", sellerId],
    queryFn: () => getSellerReviews(sellerId),
    enabled: !!sellerId,
  });

  const { data: ratingSummary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["reviews", "summary", sellerId],
    queryFn: () => getSellerRatingSummary(sellerId),
    enabled: !!sellerId,
  });

  const isLoading = isReviewsLoading || isSummaryLoading;

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  console.log("reviews", reviews);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No Reviews Yet</h3>
        <p className="text-muted-foreground mt-2">
          This seller hasn't received any reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">
            {ratingSummary?.averageRating.toFixed(1) || "0.0"}
          </div>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(ratingSummary?.averageRating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Based on {ratingSummary?.totalReviews || 0} reviews
          </div>
        </div>

        <div className="col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingSummary?.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] ||
              0;
            const totalReviews = ratingSummary?.totalReviews || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span>{rating}</span>
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="text-xs text-muted-foreground w-10 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-muted/20 transition-colors"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                  {review.reviewer?.image ? (
                    <OptimizedImage
                      width={50}
                      height={50}
                      src={review.reviewer.image}
                      alt={review.reviewer?.name || "Reviewer"}
                      className="object-cover"
                      quality="eco"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {(review.reviewer?.name || "A")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {review.reviewer?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {review.comment && (
              <p className="text-sm text-foreground/90">{review.comment}</p>
            )}

            {review.order?.item && (
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                <div className="relative h-8 w-8 rounded overflow-hidden border">
                  {review.order.item.imageId ? (
                    <OptimizedImage
                      width={50}
                      height={50}
                      src={review.order.item.imageId}
                      alt={review.order.item.name}
                      className="object-cover"
                      quality="eco"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      Item
                    </div>
                  )}
                </div>
                <span className="text-muted-foreground">
                  Review for{" "}
                  <span className="font-medium text-foreground">
                    {review.order.item.name}
                  </span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="h-10 w-16" />
          <div className="flex items-center mt-2 gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Skeleton key={star} className="h-5 w-5" />
            ))}
          </div>
          <Skeleton className="h-4 w-32 mt-2" />
        </div>

        <div className="col-span-2 space-y-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} className="h-4 w-4" />
              ))}
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
