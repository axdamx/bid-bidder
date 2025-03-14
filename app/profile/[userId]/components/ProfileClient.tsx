"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { userAtom } from "@/app/atom/userAtom";
import { SkeletonLoaderProfile } from "./SkeletonLoader";
import { UserHeader } from "./UserHeader";
import { ListingsTab } from "./ListingsTab";
import { AboutTab } from "./AboutTab";
import { ReviewsTab } from "./ReviewsTab";
import { useProfileData } from "../hooks/userProfile";
import { ProfilePageProps, Item } from "../types";
import { getPaginatedItems, getTotalPages } from "../utils/pagination";
import { useNavigation } from "../utils/navigation";

const ITEMS_PER_PAGE = 8;

export const ProfileClient = ({ params }: ProfilePageProps) => {
  const ownerId = params.userId;
  console.log(`ProfileClient rendering for ownerId: ${ownerId}`);

  const [user] = useAtom(userAtom);
  const [page, setPage] = useState(1);
  const { isNavigating } = useNavigation();

  const { userQuery, followDataQuery, ownedItemsQuery, isLoading } =
    useProfileData(ownerId, user?.id || "");

  // Use utility functions for pagination
  const paginatedItems = getPaginatedItems<Item>(
    ownedItemsQuery.data || [],
    page,
    ITEMS_PER_PAGE
  );
  
  const totalPages = getTotalPages(
    ownedItemsQuery.data?.length || 0,
    ITEMS_PER_PAGE
  );

  if (isLoading || !userQuery.data) {
    console.log("ProfileClient is in loading state");
    return <SkeletonLoaderProfile />;
  }

  if (!userQuery.data) {
    console.log("User data not found");
    return <div className="p-4 text-center">User not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Dialog open={isNavigating} modal>
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      <UserHeader
        user={userQuery.data}
        followData={followDataQuery.data}
        ownedItemsCount={ownedItemsQuery.data?.length || 0}
        currentUserId={user?.id || ""}
      />

      <Separator />

      <div className="w-full">
        <div className="px-0 sm:container">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full sm:w-auto flex justify-between sm:justify-start sm:inline-flex mt-6">
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              <ListingsTab
                items={paginatedItems}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                isLoading={ownedItemsQuery.isLoading}
              />
            </TabsContent>

            <TabsContent value="about">
              <AboutTab user={userQuery.data} />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab userId={ownerId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
