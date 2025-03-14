"use client";

import { fetchItem, fetchBids, checkBidAcknowledgmentAction } from "./actions";
import ItemPageClient from "./item-page-client";
import { MotionGrid } from "@/app/components/motionGrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { captureEvent } from "@/lib/posthog";

export default function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  // const { session } = useSupabase();
  // const user = session?.user;
  const [user] = useAtom(userAtom);
  const supabase = createClientSupabase();
  const queryClient = useQueryClient();
  const hasTrackedView = useRef(false);

  // Main item query with shorter stale time for critical data
  const { data: item, isLoading: isItemLoading } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetchItem(itemId),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    gcTime: 0,
  });

  // Bids query - load after item
  const { data: bids, isLoading: isBidsLoading } = useQuery({
    queryKey: ["bids", itemId],
    queryFn: () => fetchBids(itemId),
    enabled: !!item, // Only start loading after item is loaded
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    gcTime: 0,
  });

  // Bid acknowledgment query - non-critical, can load last
  const { data: hasAcknowledgedBid } = useQuery({
    queryKey: ["bidAcknowledgment", itemId, user?.id],
    queryFn: () => checkBidAcknowledgmentAction(itemId, user?.id ?? null),
    enabled: !!user?.id && !!item,
    refetchOnMount: "always",
    gcTime: 0,
  });

  useEffect(() => {
    // Only track when we have all the data and haven't tracked yet
    if (item && user && !hasTrackedView.current) {
      hasTrackedView.current = true;
      captureEvent("item_viewed", {
        // Item details
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.currentBid || item.startingPrice,
        itemStatus: item.status,
        itemCategory: item.category,
        // Viewer details
        viewerId: user.id,
        viewerName: user.name,
        viewerEmail: user.email,
        // Seller details
        sellerId: item.userId,
        sellerName: item.name,
        // Metadata
        timestamp: new Date().toISOString(),
      });
    }
  }, [item, user]);

  useEffect(() => {
    const channel = supabase
      .channel(`item-bids-${itemId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `itemId=eq.${itemId}`,
        },
        async (payload) => {
          // Change to async function
          // console.log("Payload la", payload.new);
          // Fetch user info based on userId from the payload
          const { data: userData, error: userError } = await supabase
            .from("users") // Assuming your user table is named 'users'
            .select("*")
            .eq("id", payload.new.userId) // Use userId from the payload
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return;
          }
          // Invalidate queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ["bids", itemId] });
          queryClient.invalidateQueries({ queryKey: ["item", itemId] });

          // Optionally show toast notification here if you want it at global level
          toast.success(
            `New bid received: ${formatCurrency(payload.new.amount)} by ${
              userData.name
            }`
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, queryClient, supabase]);

  // Show loading state only for critical item data
  if (isItemLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-300 animate-enhanced-pulse rounded-lg"></div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-300 animate-enhanced-pulse rounded-md"
                ></div>
              ))}
            </div>
          </div>

          {/* Auction Details Skeleton */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="h-8 bg-gray-300 animate-enhanced-pulse rounded"></div>
              <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-8 w-full">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-300 animate-enhanced-pulse rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-gray-300 animate-enhanced-pulse rounded"></div>
              <div className="h-10 bg-gray-300 animate-enhanced-pulse rounded w-full"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="h-8 bg-gray-300 animate-enhanced-pulse rounded w-1/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-full"></div>
                  <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-full"></div>
                  <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> Item Not Found! </h1>
      </div>
    );
  }

  return (
    <MotionGrid
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Toaster
        toastOptions={{ duration: 3000 }}
        position="top-right"
        reverseOrder={false}
      />
      <ItemPageClient
        item={item}
        allBids={bids || []}
        userId={user?.id!}
        hasAcknowledgedBid={hasAcknowledgedBid || false}
        isLoadingBids={isBidsLoading}
        onBidAcknowledge={() => {
          queryClient.invalidateQueries({
            queryKey: ["bidAcknowledgment", itemId, user?.id],
          });
          queryClient.invalidateQueries({ queryKey: ["bids", itemId] });
        }}
      />
    </MotionGrid>
  );
}
