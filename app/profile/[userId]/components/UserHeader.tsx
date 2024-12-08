import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Package, Star, Users } from "lucide-react";
import { FollowButton } from "./follow-button";

interface UserHeaderProps {
  user: any; // Replace 'any' with a proper user type
  followData: any; // Replace 'any' with a proper follow data type
  ownedItemsCount: number;
  currentUserId: string;
}

export const UserHeader = ({
  user,
  followData,
  ownedItemsCount,
  currentUserId,
}: UserHeaderProps) => {
  return (
    <>
      <div className="relative h-48 bg-muted rounded-lg mt-4">
        <div className="absolute -bottom-16 left-8 flex items-end gap-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="mb-1 flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              • Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="container flex flex-col sm:flex-row items-center sm:items-start justify-between py-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Package className="h-4 w-4" />
              <span className="text-base sm:text-lg">
                {ownedItemsCount} Listings
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Users className="h-4 w-4" />
              <span className="text-base sm:text-lg">
                {followData?.followersCount || 0} Followers
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Star className="h-4 w-4" />
              <span className="text-base sm:text-lg">
                {user.rating || 0} Rating
              </span>
            </div>
          </div>
          {user.id !== currentUserId && (
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <FollowButton
                targetUserId={user.id}
                currentUserId={currentUserId}
                initialIsFollowing={followData?.isFollowing || false}
                followersCount={followData?.followersCount || 0}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
