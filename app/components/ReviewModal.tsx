"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { userAtom } from "../atom/userAtom";
import { createReview } from "../dashboard/reviews/action";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  sellerId: string;
  sellerName?: string;
  sellerImage?: string;
  itemName: string;
  itemImage?: string;
}

export function ReviewModal({
  open,
  onOpenChange,
  orderId,
  sellerId,
  sellerName = "Seller",
  sellerImage,
  itemName,
  itemImage,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [user] = useAtom(userAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return await createReview({
        orderId,
        sellerId,
        reviewerId: user.id,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", sellerId] });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      onOpenChange(false);
      setRating(0);
      setComment("");
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Error submitting review",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    submitReview();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Rate Your Experience
          </DialogTitle>
          <DialogDescription className="text-center">
            Share your experience with the seller and help others make informed decisions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item and Seller Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
              {itemImage ? (
                <OptimizedImage
                  width={100}
                  height={100}
                  src={itemImage}
                  alt={itemName}
                  className="object-cover"
                  quality="eco"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                  Item
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{itemName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative h-6 w-6 rounded-full overflow-hidden border">
                  {sellerImage ? (
                    <OptimizedImage
                      width={50}
                      height={50}
                      src={sellerImage}
                      alt={sellerName}
                      className="object-cover"
                      quality="eco"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      {sellerName.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sold by <span className="font-medium">{sellerName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-all duration-150"
                  >
                    <StarIcon
                      className={cn(
                        "h-8 w-8",
                        (hoverRating ? star <= hoverRating : star <= rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this seller..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your review will be visible to other users and helps maintain quality in our marketplace.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
            className="flex-1 sm:flex-none"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
