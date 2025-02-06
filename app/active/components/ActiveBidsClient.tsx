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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => {
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
            <div className="aspect-[16/9] relative">
              <OptimizedImage
                quality="eco"
                src={item.imageId}
                alt={item.title}
                fill
                className="object-cover w-full h-full rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <Link
                  href={`/items/${item.id}`}
                  className="font-medium hover:underline block text-lg mb-1"
                >
                  {item.title}
                </Link>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <ActiveCountdownTimer
                  endDate={item.endDate}
                  onExpire={onTimerExpire}
                />
                <div className="text-sm opacity-90">
                  Ends {format(new Date(item.endDate), "MMM d, h:mma")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Current Price</div>
                <div className="font-medium">
                  {formatCurrency(item.currentBid)}
                </div>
                <div className="text-muted-foreground">Your Bid</div>
                <div className="font-medium">{formatCurrency(yourBid)}</div>
                <div className="text-muted-foreground">Are you winning?</div>
                <div className="font-medium">{isWinning.toString()}</div>
              </div>
              <Button asChild className="w-full">
                <Link href={`/items/${item.id}`}>View Item</Link>
              </Button>
            </div>
          </Card>
        );
      })}
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
          <Link href="/auctions?tab=live">Browse Live Auctions</Link>
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
    refetchInterval: 5000,
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
