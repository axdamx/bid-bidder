"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveBids } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import { formatCurrency } from "@/lib/utils";
import { ActiveCountdownTimer } from "./ActiveCountdownTimer";

function GridView({
  items,
  onTimerExpire,
}: {
  items: any[];
  onTimerExpire: () => void;
}) {
  const [user] = useAtom(userAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  // Sort items by latest bid timestamp before pagination
  const sortedItems = [...items].sort((a, b) => {
    const latestBidA =
      a.bids && a.bids.length > 0
        ? Math.max(
            ...a.bids.map((bid: any) => new Date(bid.timestamp).getTime())
          )
        : 0;
    const latestBidB =
      b.bids && b.bids.length > 0
        ? Math.max(
            ...b.bids.map((bid: any) => new Date(bid.timestamp).getTime())
          )
        : 0;
    return latestBidB - latestBidA; // Sort in descending order (newest first)
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((item) => {
          let currentBid = item.currentBid || 0;
          let yourBid = 0;
          let isWinning = false;

          if (item.bids && item.bids.length > 0) {
            const yourBids = item.bids.filter(
              (bid: any) => bid.userId === user?.id
            );
            yourBid =
              yourBids.length > 0
                ? Math.max(...yourBids.map((bid: any) => bid.amount))
                : 0;
            isWinning = yourBid >= currentBid;
          }

          return (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-[16/9] relative overflow-hidden">
                <OptimizedImage
                  quality="eco"
                  src={item.imageId}
                  alt={item.title}
                  fill
                  className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <Link
                    href={`/app/items/${item.id}`}
                    className="font-medium hover:underline block text-lg mb-1"
                  >
                    {item.name}
                  </Link>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isWinning && item.status === "LIVE" ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        Currently Winning
                      </span>
                    ) : item.status === "LIVE" ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                        Outbid
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                        Auction Ended
                      </span>
                    )}
                  </div>
                  <ActiveCountdownTimer
                    status={item.status}
                    endDate={item.endDate}
                    onExpire={onTimerExpire}
                  />
                </div>

                {/* Price Information */}
                <div className="grid grid-cols-2 gap-3 text-sm h-full">
                  <div className="flex flex-col">
                    <div className="text-muted-foreground mb-1">
                      Current Price
                    </div>
                    <div className="font-semibold text-lg">
                      {formatCurrency(item.currentBid)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-muted-foreground mb-1">
                      Your Highest Bid
                    </div>
                    <div className="font-semibold text-lg">
                      {formatCurrency(yourBid)}
                    </div>
                  </div>
                </div>

                {/* Bid Position & Time Info */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Position</span>
                    <span className="font-medium">
                      {isWinning ? "Highest Bidder" : "Not Highest Bidder"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">
                      {format(new Date(item.endDate), "MMM d, h:mma")}
                    </span>
                  </div>
                  {item.bids && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Bids</span>
                      <span className="font-medium">{item.bids.length}</span>
                    </div>
                  )}
                </div>

                <Button asChild className="w-full">
                  <Link href={`/app/items/${item.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function LoadingState({ view }: { view: "grid" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full" />
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Active Bids</h3>
        <p className="text-muted-foreground mb-4">
          You haven't placed any bids yet. Start bidding on items you're
          interested in!
        </p>
        <Button asChild>
          <Link href="/app/auctions?tab=live">Browse Live Auctions</Link>
        </Button>
      </div>
    </Card>
  );
}

export function ActiveBidsClient() {
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();

  const handleTimerExpire = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["activeBids"] });
  }, [queryClient]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["activeBids"],
    queryFn: () => getActiveBids(),
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // refetchInterval: 5000,
  });

  if (!user) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your active bids.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Active Bids</h1>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Please note: The information displayed here may not reflect
                real-time updates. For the most current data, please visit the
                original item listing page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState view="grid" />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <GridView items={items} onTimerExpire={handleTimerExpire} />
      )}
    </div>
  );
}
