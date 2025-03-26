"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "../action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing,
  followersCount = 0,
  className,
}: {
  targetUserId: string;
  currentUserId: string | null;
  initialIsFollowing: boolean;
  followersCount?: number;
  className?: string;
}) {
  // Initialize the state with the initialIsFollowing prop
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const queryClient = useQueryClient();
  const followMutation = useMutation({
    mutationFn: () => followUser(currentUserId!, targetUserId),
    onSuccess: () => {
      setIsFollowing(true);
      // Immediately update the cache with the new followers count
      queryClient.setQueryData(
        ["followData", currentUserId, targetUserId],
        (old: any) => ({
          ...old,
          followersCount: followersCount + 1,
          isFollowing: true,
        })
      );
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(currentUserId!, targetUserId),
    onSuccess: () => {
      setIsFollowing(false);
      // Immediately update the cache with the new followers count
      queryClient.setQueryData(
        ["followData", currentUserId, targetUserId],
        (old: any) => ({
          ...old,
          followersCount: followersCount - 1,
          isFollowing: false,
        })
      );
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
      disabled={
        followMutation.isPending || unfollowMutation.isPending || !currentUserId
      }
      variant={isFollowing ? "outline" : "default"}
      className={`w-full mt-4 sm:mt-0 sm:w-auto ${className || ""}`}
    >
      {followMutation.isPending || unfollowMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
