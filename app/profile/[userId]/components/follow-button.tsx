// app/components/FollowButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "../action";

export function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing,
}: {
  targetUserId: string;
  currentUserId: string | null;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  const handleFollow = async () => {
    if (!currentUserId) return;

    setIsPending(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(currentUserId, targetUserId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setIsPending(false);
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
