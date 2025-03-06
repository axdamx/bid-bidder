import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Package, Star, Users } from "lucide-react";
import { FollowButton } from "./follow-button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSellerRatingSummary } from "@/app/dashboard/reviews/action";

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
  // State to control animation - helps with performance by reducing animation when not visible
  const [isVisible, setIsVisible] = useState(false);

  // Fetch the user's rating summary
  const { data: ratingSummary } = useQuery({
    queryKey: ["reviews", "summary", user.id],
    queryFn: () => getSellerRatingSummary(user.id),
    enabled: !!user.id,
  });

  useEffect(() => {
    // Only start animation when component is mounted and visible
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Clean up animation when component unmounts to save resources
    return () => {
      clearTimeout(timer);
      setIsVisible(false);
    };
  }, []);

  return (
    <>
      {/* Header container with proper spacing */}
      <div className="relative h-60 sm:h-64 rounded-lg mt-4 overflow-visible">
        {/* Aurora gradient background with animation - using will-change for hardware acceleration */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-cyan-600 via-lime-600 to-purple-500 bg-[length:300%_300%] rounded-lg ${
            isVisible ? "animate-aurora" : ""
          }`}
          style={{
            willChange: "background-position",
            transform: "translateZ(0)", // Force GPU acceleration
          }}
        />

        {/* Overlay with radial gradient for aurora effect */}
        <div className="absolute inset-0 bg-black/10 rounded-lg">
          <div
            className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-70 mix-blend-overlay rounded-lg"
            style={{
              willChange: "opacity",
              transform: "translateZ(0)", // Force GPU acceleration
            }}
          ></div>
        </div>

        {/* User info section with proper z-index to ensure visibility */}
        <div className="absolute bottom-0 translate-y-1/2 left-4 sm:left-8 flex items-end gap-3 sm:gap-4 z-10">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg ring-2 ring-black/5">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="mb-1 flex flex-col gap-1 px-3 rounded-md">
            <h1 className="text-xl sm:text-2xl font-bold text-black drop-shadow-md ">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground drop-shadow-sm">
              • Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Increase top margin to make room for the avatar and name */}
      <div className="mt-16 sm:mt-24">
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
                {ratingSummary?.averageRating.toFixed(1) || "0.0"} Rating ({ratingSummary?.totalReviews || 0} reviews)
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
