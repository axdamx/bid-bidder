"use client";

import PostFeed from "./components/PostFeed";
import { MotionGrid } from "@/app/components/motionGrid";
import { ProfileHeader } from "./components/ProfileHeader";
import { Stats } from "./components/StatContainer";
import { About } from "./components/AboutContainer";
import { Location } from "./components/LocationContainer";
import { SocialLinks } from "./components/SocialsContainer";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "./action";
import { SkeletonLoaderProfile } from "./components/SkeletonLoader";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { useQueries } from "@tanstack/react-query";

export default function ProfilePage({
  params: { userId: ownerId },
}: {
  params: { userId: string };
}) {
  const [user] = useAtom(userAtom); // current logged in user

  const queries = useQueries({
    queries: [
      {
        queryKey: ["user", ownerId],
        queryFn: () => fetchUser(ownerId),
      },
      {
        queryKey: ["followData", user?.id, ownerId],
        queryFn: () => fetchFollowData(user?.id || "", ownerId),
      },
      {
        queryKey: ["ownedItems", ownerId],
        queryFn: () => fetchOwnedItems(ownerId),
      },
    ],
  });

  const [userQuery, followDataQuery, ownedItemsQuery] = queries;
  const isLoading = queries.some((query) => query.isLoading);

  if (isLoading) {
    return <SkeletonLoaderProfile />;
  }

  if (!userQuery) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> User Not Found! </h1>
      </div>
    );
  }

  return (
    <MotionGrid>
      <div className="container mx-auto p-4">
        <ProfileHeader user={userQuery.data} />
        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="md:w-1/4 space-y-4 mb-6">
            <Stats
              itemsCount={ownedItemsQuery.data?.length || 0}
              followersCount={followDataQuery.data?.followersCount || 0}
              followingCount={followDataQuery.data?.followingCount || 0}
              userId={ownerId}
              currentUserId={user?.id}
              isFollowing={followDataQuery.data?.isFollowing || false}
            />
            <About />
            <Location />
            <SocialLinks />
          </div>
          <PostFeed ownedItems={ownedItemsQuery.data} />
        </div>
      </div>
    </MotionGrid>
  );
}
