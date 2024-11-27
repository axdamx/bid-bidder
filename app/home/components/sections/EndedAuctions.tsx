// import { getEndedAuctions } from "@/app/action";
// import ItemCard from "@/app/item-card";
"use client";
import { getEndedAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { useState, useEffect } from "react";
import { SkeletonCard } from "../SkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ItemCarousel } from "../ItemCarousel";

// export async function EndedAuctions({ limit = 3 }: { limit?: number }) {
//   const items = (await getEndedAuctions()).slice(0, limit);

//   return (
//     <section className="bg-gray-100 py-10">
//       {/* <h2 className="text-center text-3xl font-bold mb-6">Recent Auctions</h2> */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
//         {items.map((item) => (
//           <ItemCard key={item.id} item={item} />
//         ))}
//       </div>
//     </section>
//   );
// }
export function EndedAuctions({ limit }: { limit?: number }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["endedAuctions"],
    queryFn: () => getEndedAuctions(),
    staleTime: 0, // Set to 0 to always check for updates
    refetchOnMount: true, // Refetch when component mounts
  });
  return (
    <ItemCarousel
      items={items.slice(0, 6)}
      isLoading={isLoading}
      title="Ended Auctions"
      description="View all the ended auctions"
      viewAllLink="ended"
    />
  );
}
