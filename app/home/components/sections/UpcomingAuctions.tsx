"use client";

import { getUpcomingAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { useState, useEffect } from "react";
import { SkeletonCard } from "../SkeletonLoader";
import { useQuery } from "@tanstack/react-query";

export function UpcomingAuctions() {
  // const [items, setItems] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["upcomingAuctions"],
    queryFn: () => getUpcomingAuctions(),
    staleTime: 0, // Set to 0 to always check for updates
    refetchOnMount: true, // Refetch when component mounts
  });

  return (
    <section className="w-full">
      {/* <h2 className="text-center text-3xl font-bold mb-6">Upcoming Auctions</h2> */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Upcoming Auctions
            </h2>
            <p className="text-muted-foreground mt-1">
              Don't miss these upcoming drops
            </p>
          </div>
          <a href="/upcoming" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(2)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <MotionGrid
                key={item.id}
                // className="w-full min-w-[300px] md:min-w-[400px] rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <ItemCard key={item.id} item={item} />
              </MotionGrid>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
