"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { userAtom } from "@/app/atom/userAtom";
import { SkeletonLoaderProfile } from "./components/SkeletonLoader";
import { UserHeader } from "./components/UserHeader";
import { ListingsTab } from "./components/ListingsTab";
import { AboutTab } from "./components/AboutTab";
import { ReviewsTab } from "./components/ReviewsTab";
import { useProfileData } from "./hooks/userProfile";

const ProfilePage = ({
  params: { userId: ownerId },
}: {
  params: { userId: string };
}) => {
  console.log(`ProfilePage rendering for ownerId: ${ownerId}`);

  const [user] = useAtom(userAtom);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { userQuery, followDataQuery, ownedItemsQuery, isLoading, isFetching } =
    useProfileData(ownerId, user?.id || "");

  useEffect(() => {
    console.log(
      `useEffect triggered. pathname: ${pathname}, isNavigating: ${isNavigating}`
    );
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [pathname, isNavigating]);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    console.log(`handleLinkClick called with path: ${path}`);
    e.preventDefault();
    if (path === pathname) return;
    setIsNavigating(true);
    router.push(path);
  };

  const paginatedItems =
    ownedItemsQuery.data?.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    ) || [];
  const totalPages = Math.ceil(
    (ownedItemsQuery.data?.length || 0) / itemsPerPage
  );

  if (isLoading) {
    console.log("ProfilePage is in loading state");
    return <SkeletonLoaderProfile />;
  }
  if (!userQuery.data) {
    console.log("User data not found");
    return <div>User not found</div>;
  }

  console.log(`ProfilePage rendering completed for ownerId: ${ownerId}`);

  return (
    <div className="min-h-screen">
      {(isNavigating || isFetching) && (
        <Dialog open={true} modal>
          <DialogTitle className="[&>button]:hidden" />
          <DialogContent className="[&>button]:hidden">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                handleLinkClick={handleLinkClick}
              />
            </TabsContent>

            <TabsContent value="about">
              <AboutTab user={userQuery.data} />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
