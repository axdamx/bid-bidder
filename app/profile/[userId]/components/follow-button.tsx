"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "../action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing,
}: {
  targetUserId: string;
  currentUserId: string | null;
  initialIsFollowing: boolean;
}) {
  // Initialize the state with the initialIsFollowing prop
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();

  // Replace the manual mutation handling with React Query mutations
  const followMutation = useMutation({
    mutationFn: () => followUser(currentUserId!, targetUserId),
    onSuccess: () => {
      setIsFollowing(true);
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["followData", currentUserId, targetUserId],
      });
    },
    onError: (error) => {
      console.error("Follow failed:", error);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(currentUserId!, targetUserId),
    onSuccess: () => {
      setIsFollowing(false);
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["followData", currentUserId, targetUserId],
      });
    },
    onError: (error) => {
      console.error("Unfollow failed:", error);
    },
  });

  const handleFollow = async () => {
    if (!currentUserId) return;

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (currentUserId === targetUserId) return null;

  return (
    <Button
      onClick={handleFollow}
      disabled={isPending || !currentUserId}
      variant={isFollowing ? "outline" : "default"}
    >
      {isPending ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
