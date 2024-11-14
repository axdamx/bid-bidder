"use client";

import { useState, useEffect } from "react";
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
  // Initialize the state with the initialIsFollowing prop
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    console.log("Initial isFollowing:", initialIsFollowing);
    console.log("Current isFollowing state:", isFollowing);
  }, [initialIsFollowing, isFollowing]);

  // const handleFollow = async () => {
  //   if (!currentUserId) return;

  //   setIsPending(true);

  //   // Simulate follow/unfollow action
  //   try {
  //     if (isFollowing) {
  //       // Simulate unfollow action
  //       console.log(`Unfollowing user: ${targetUserId}`);
  //       setIsFollowing(false);
  //     } else {
  //       // Simulate follow action
  //       console.log(`Following user: ${targetUserId}`);
  //       setIsFollowing(true);
  //     }
  //   } catch (error) {
  //     console.error("Follow action failed:", error);
  //   } finally {
  //     setIsPending(false);
  //   }
  // };
  const handleFollow = async () => {
    if (!currentUserId) return;

    setIsPending(true);

    try {
      if (isFollowing) {
        const response = await unfollowUser(currentUserId, targetUserId);
        if (response.success) {
          setIsFollowing(false);
        } else {
          console.error("Unfollow failed:", response.error);
        }
      } else {
        const response = await followUser(currentUserId, targetUserId);
        if (response.success) {
          setIsFollowing(true);
        } else {
          console.error("Follow failed:", response.error);
        }
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
