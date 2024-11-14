"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/app/context/SupabaseContext";
import PostFeed from "./components/PostFeed";
import { MotionGrid } from "@/app/components/motionGrid";
import { ProfileHeader } from "./components/ProfileHeader";
import { Stats } from "./components/StatContainer";
import { About } from "./components/AboutContainer";
import { Location } from "./components/LocationContainer";
import { SocialLinks } from "./components/SocialsContainer";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "./action";
import { SkeletonCard } from "@/app/home/components/SkeletonLoader";
import {
  SkeletonLoaderProfile,
  SkeletonProfileHeader,
  SkeletonProfileSection,
  SkeletonTable,
} from "./components/SkeletonLoader";

export default function ProfilePage({ params: { userId: ownerId } }) {
  const { session } = useSupabase();
  const user = session?.user; // my user

  const [profileUser, setProfileUser] = useState(null);
  const [followData, setFollowData] = useState({});
  const [ownedItems, setOwnedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const fetchedUser = await fetchUser(ownerId);
      setProfileUser(fetchedUser);

      const followData = await fetchFollowData(user?.id, ownerId);
      setFollowData(followData);

      const ownedItems = await fetchOwnedItems(ownerId);
      setOwnedItems(ownedItems);

      setIsLoading(false);
    };

    fetchData();
  }, [ownerId, user]);

  if (isLoading) {
    return <SkeletonLoaderProfile />;
  }

  if (!profileUser) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> User Not Found! </h1>
      </div>
    );
  }

  return (
    <MotionGrid>
      <div className="container mx-auto p-4">
        <ProfileHeader user={profileUser} />
        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="md:w-1/4 space-y-4 mb-6">
            <Stats
              itemsCount={ownedItems.length}
              followersCount={followData.followersCount}
              followingCount={followData.followingCount}
              userId={ownerId}
              currentUserId={user?.id}
              isFollowing={followData.isFollowing}
            />
            <About />
            <Location />
            <SocialLinks />
          </div>
          <PostFeed ownedItems={ownedItems} />
        </div>
      </div>
    </MotionGrid>
  );
}
