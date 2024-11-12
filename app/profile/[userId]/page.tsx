import { database } from "@/src/db/database";
import { items, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import ItemCard from "@/app/item-card";
import { EmptyState } from "@/app/auctions/empty-state";

export default async function ProfilePage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const allItems = await database.query.items.findMany({
    where: eq(items.userId, userId),
  });

  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const session = await auth(); // Your auth implementation
  const currentUserId = session?.user?.id;

  const { isFollowing } = await getFollowStatus(currentUserId!, userId);
  const { followersCount, followingCount } = await getFollowCounts(userId);

  const { ownedItems, error } = await getItemsByUserId(userId);
  if (error) {
    // Handle error
  } else {
    // Use items
    // console.log("ownedItems", ownedItems);
  }

  // console.log("followersCount", followersCount);
  // console.log("followingCount", followingCount);

  if (!user) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> User Not Found! </h1>
      </div>
    );
  }

  // const numberOfItems = allItems.length;
  // console.log("numberOfItems", numberOfItems);

  return (
    <MotionGrid>
      <div className="container mx-auto p-4">
        <ProfileHeader user={user} />
        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="md:w-1/4 space-y-4 mb-6">
            <Stats
              itemsCount={ownedItems.length}
              followersCount={followersCount}
              followingCount={followingCount}
              userId={userId}
              currentUserId={currentUserId}
              isFollowing={isFollowing}
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
// ProfilePage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FollowButton } from "./components/follow-button";
import { auth } from "@/app/auth";
import { getFollowCounts, getFollowStatus, getItemsByUserId } from "./action";
import { MotionGrid } from "@/app/components/motionGrid";
import ProfileTable from "./components/profileTable";
import { useState } from "react";
import PostFeed from "./components/PostFeed";
import {
  Facebook,
  Instagram,
  LinkedinIcon,
  MapPin,
  Share2,
  Twitter,
  User,
  Youtube,
} from "lucide-react";

export function ProfileHeader({ user }) {
  console.log("user", user);
  return (
    <div
      className="relative w-full h-64 bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: "url('/path/to/background-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-700 opacity-50" />
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.image} alt="@shadcn" sizes="lg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>{" "}
        <div>
          <h1 className="text-xl font-semibold text-white">{user.name}</h1>
          <h1 className="text-sm text-gray-200">{user.email}</h1>
        </div>
      </div>
    </div>
  );
}

function Stats({
  itemsCount,
  followersCount,
  followingCount,
  userId,
  currentUserId,
  isFollowing,
}) {
  // const numberOfItems = items.length;
  return (
    <Card className="p-4 text-center">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h1 className="text-xl font-semibold">{itemsCount}</h1>
          <h1 className="text-gray-500 text-sm">Posts</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{followersCount}</h1>
          <h1 className="text-gray-500 text-sm">Followers</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{followingCount}</h1>
          <h1 className="text-gray-500 text-sm">Following</h1>
        </div>
        <div className="col-span-3">
          <FollowButton
            targetUserId={userId}
            currentUserId={currentUserId}
            initialIsFollowing={isFollowing}
          />
        </div>
      </div>
    </Card>
  );
}

function About() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {/* <User className="h-5 w-5 text-gray-500" /> */}
        <h2 className="text-lg font-semibold">About me</h2>
      </div>
      <p className="text-gray-700 mt-2">
        Big Boy is a big boy from KL. He is a big boy from KL.
      </p>
    </Card>
  );
}

function Location() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {/* <MapPin className="h-5 w-5 text-gray-500" /> */}
        <h2 className="text-lg font-semibold">Location</h2>
      </div>
      <p className="text-gray-700 mt-2">KL, Malaysia</p>
    </Card>
  );
}

function SocialLinks() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {/* <Share2 className="h-5 w-5 text-gray-500" /> */}
        <h1 className="text-lg font-semibold">Social Links</h1>
      </div>
      <div className="flex space-x-4 mt-2">
        <Facebook className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
        <Instagram className="h-5 w-5 text-gray-500 hover:text-pink-600 cursor-pointer" />
        <Twitter className="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer" />
        <Youtube className="h-5 w-5 text-gray-500 hover:text-red-600 cursor-pointer" />
        <LinkedinIcon className="h-5 w-5 text-gray-500 hover:text-blue-700 cursor-pointer" />
      </div>
    </Card>
  );
}
