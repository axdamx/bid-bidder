"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "./action";
import { useQueries } from "@tanstack/react-query";
import { SkeletonLoaderProfile } from "./components/SkeletonLoader";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { useEffect, useState } from "react";
import { FollowButton } from "./components/follow-button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProfilePage({
  params: { userId: ownerId },
}: {
  params: { userId: string };
}) {
  const [user] = useAtom(userAtom);
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // Changed to 8 to match the grid layout (2x2 on small screens, 4x4 on large)
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsNavigating(false);
    // setIsOpen(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    // setIsOpen(false);
    // Don't navigate if we're already on the target path
    if (path === pathname) {
      return;
    }
    setIsNavigating(true);
    await router.push(path);
  };

  const paginatedItems =
    ownedItemsQuery.data?.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    ) || [];
  const totalPages = Math.ceil(
    (ownedItemsQuery.data?.length || 0) / itemsPerPage
  );

  console.log("userQuery.data", userQuery.data);

  if (isLoading) return <SkeletonLoaderProfile />;
  if (!userQuery.data) return <div>User not found</div>;

  console.log("userQuery.data", userQuery.data);
  console.log("followDataQuery.data", followDataQuery.data);
  console.log("ownedItemsQuery.data", ownedItemsQuery.data);

  return (
    <div className="min-h-screen">
      <Dialog open={isNavigating} modal>
        <DialogTitle className="[&>button]:hidden" />
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>
      {/* Hero Section */}
      <div className="relative h-48 bg-muted rounded-lg mt-4">
        <div className="absolute -bottom-16 left-8 flex items-end gap-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage
              src={userQuery.data.image || "/placeholder.svg"}
              alt={userQuery.data.name}
            />
            <AvatarFallback>{userQuery.data.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="mb-1 flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{userQuery.data.name}</h1>
            <p className="text-sm text-muted-foreground">
              • Joined{" "}
              {new Date(userQuery.data.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats and Follow Button */}
      <div className="mt-20 border-b">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="text-lg">
                {ownedItemsQuery.data?.length || 0} Listings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-lg">
                {followDataQuery.data?.followersCount || 0} Followers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-lg">
                {userQuery.data.rating || 0} Rating
              </span>
            </div>
          </div>
          {user?.id !== ownerId && (
            <div className="w-full sm:w-auto">
              <FollowButton
                targetUserId={ownerId}
                currentUserId={user?.id || ""}
                initialIsFollowing={followDataQuery.data?.isFollowing || false}
                followersCount={followDataQuery.data?.followersCount || 0}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginatedItems.length > 0 ? (
                paginatedItems?.map((item, index) => (
                  <Card key={item.id} className="overflow-hidden h-fit">
                    <CardContent className="p-0">
                      <MotionGrid
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.125 }}
                      >
                        <ItemCard key={item.id} item={item} />
                      </MotionGrid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <MotionGrid
                  // key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.125 }}
                >
                  <Card className="col-span-full p-6">
                    <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">No Listings Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Get started by creating your first auction listing
                      </p>
                      <Link
                        href="/items/create"
                        className="hover:underline whitespace-nowrap"
                        onClick={(e) => handleLinkClick(e, "/items/create")}
                      >
                        <Button>Create Auction</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </MotionGrid>
              )}
            </div>
            {/* {paginatedItems?.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <span className="flex items-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )} */}
            {paginatedItems.length > 0 && (
              <Pagination className="justify-center p-4">
                {/* Added padding to the pagination */}
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setPage(pageNumber)}
                          isActive={pageNumber === page}
                          className="cursor-pointer opacity-100"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <MotionGrid
              // key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.125 }}
            >
              <Card>
                <CardContent className="grid gap-4 p-6">
                  <div>
                    <h3 className="font-semibold">About Me</h3>
                    {userQuery.data.about && (
                      <p className="text-sm text-muted-foreground">
                        {userQuery.data.about}
                      </p>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {userQuery.data.city && (
                      <p className="text-sm text-muted-foreground">
                        {userQuery.data.city}, {userQuery.data.country}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {userQuery.data.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Member since{" "}
                        {new Date(userQuery.data.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </MotionGrid>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <MotionGrid
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.125 }}
              >
                <Card key={i}>
                  <CardContent className="grid gap-4 p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="Reviewer" />
                        <AvatarFallback>RV</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">John Doe</span>
                          <span className="text-sm text-muted-foreground">
                            • 2 weeks ago
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing seller! The vintage watch I purchased was exactly
                      as described and arrived quickly. Sarah was very
                      communicative throughout the process. Highly recommended!
                    </p>
                  </CardContent>
                </Card>
              </MotionGrid>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
