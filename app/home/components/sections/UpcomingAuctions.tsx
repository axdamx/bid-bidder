"use client";

import { getUpcomingAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { useState, useEffect } from "react";
import { SkeletonCard } from "../SkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { ItemCarousel } from "../ItemCarousel";

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
    <ItemCarousel
      items={items}
      isLoading={isLoading}
      title="Upcoming Auctions"
      description="View all the upcoming auctions"
      viewAllLink="/auctions"
    />
  );
}
