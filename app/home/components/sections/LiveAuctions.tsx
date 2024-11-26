// // "use client"; // Add this at the top

// // import { getLiveAuctions } from "@/app/action";
// // import { MotionGrid } from "@/app/components/motionGrid";
// // import Spinner from "@/app/components/Spinner";
// // import ItemCard from "@/app/item-card";
// // import { motion } from "framer-motion";
// // import { useEffect, useState } from "react";
// // import { SkeletonCard } from "../SkeletonLoader";
// // import { useQuery } from "@tanstack/react-query";

// // export function LiveAuctions() {
// //   // Remove async
// //   // Change to use client-side data fetching or pass data as props
// //   const { data: items = [], isLoading } = useQuery({
// //     queryKey: ["liveAuctions"],
// //     queryFn: () => getLiveAuctions(),
// //     staleTime: 0, // Set to 0 to always check for updates
// //     refetchOnMount: true, // Refetch when component mounts
// //   });

// //   return (
// //     <section className="w-full">
// //       <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
// //         <div className="flex items-center justify-between mb-6">
// //           <div>
// //             <h2 className="text-2xl font-bold md:text-3xl">Live Auctions</h2>
// //             <p className="text-muted-foreground mt-1">Bid on active auctions</p>
// //           </div>
// //           <a href="/auctions" className="text-primary hover:text-primary/80">
// //             View all →
// //           </a>
// //         </div>
// //         {isLoading ? (
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             {[...Array(3)].map((_, index) => (
// //               <SkeletonCard key={index} />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             {items.map((item, index) => (
// //               <MotionGrid
// //                 key={item.id}
// //                 // className="w-full min-w-[300px] md:min-w-[400px] rounded-xl overflow-hidden"
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 transition={{ delay: index * 0.2 }}
// //               >
// //                 <ItemCard key={item.id} item={item} />
// //               </MotionGrid>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </section>
// //   );
// // }

// "use client";

// import { getLiveAuctions } from "@/app/action";
// import { MotionGrid } from "@/app/components/motionGrid";
// import ItemCard from "@/app/item-card";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { SkeletonCard } from "../SkeletonLoader";
// import useEmblaCarousel from "embla-carousel-react";

// export function LiveAuctions() {
//   const [api] = useEmblaCarousel({
//     align: "start",
//     skipSnaps: false,
//   });

//   const { data: items = [], isLoading } = useQuery({
//     queryKey: ["liveAuctions"],
//     queryFn: () => getLiveAuctions(),
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   return (
//     <section className="w-full py-12">
//       <div className="container">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold md:text-3xl">Live Auctions</h2>
//             <p className="text-muted-foreground mt-1">Bid on active auctions</p>
//           </div>
//           <a href="/auctions" className="text-primary hover:text-primary/80">
//             View all →
//           </a>
//         </div>

//         <div className="relative">
//           <Carousel
//             opts={{
//               loop: true,
//               align: "start",
//               skipSnaps: false,
//             }}
//           >
//             <CarouselContent ref={api}>
//               {isLoading
//                 ? // Skeleton loading state
//                   [...Array(3)].map((_, index) => (
//                     <CarouselItem key={index} className="md:basis-full pl-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[800px] h-full">
//                         {/* {index === 0 && (
//                         <SkeletonCard className="md:row-span-2 h-full" />
//                       )}
//                       {index < 2 && <SkeletonCard className="h-[380px]" />}
//                       {index < 2 && <SkeletonCard className="h-[380px]" />} */}
//                       </div>
//                     </CarouselItem>
//                   ))
//                 : // Actual items
//                   Array.from({ length: Math.ceil(items.length / 3) }).map(
//                     (_, groupIndex) => (
//                       <CarouselItem
//                         key={groupIndex}
//                         className="md:basis-full pl-4"
//                       >
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[800px] h-full">
//                           {/* Large left item */}
//                           {items[groupIndex * 3] && (
//                             <MotionGrid
//                               // className="md:row-span-2 h-full"
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               transition={{ delay: 0.1 }}
//                             >
//                               <ItemCard
//                                 item={items[groupIndex * 3]}
//                                 // className="h-full aspect-square"
//                               />
//                             </MotionGrid>
//                           )}
//                           {/* Right column items */}
//                           <div className="space-y-6">
//                             {items
//                               .slice(groupIndex * 3 + 1, groupIndex * 3 + 3)
//                               .map((item, index) => (
//                                 <MotionGrid
//                                   key={item.id}
//                                   // className="h-[380px]"
//                                   initial={{ opacity: 0 }}
//                                   animate={{ opacity: 1 }}
//                                   transition={{ delay: (index + 1) * 0.1 }}
//                                 >
//                                   <ItemCard
//                                     item={item}
//                                     // className="h-full aspect-[4/3]"
//                                   />
//                                 </MotionGrid>
//                               ))}
//                           </div>
//                         </div>
//                       </CarouselItem>
//                     )
//                   )}
//             </CarouselContent>
//             <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
//             <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
//           </Carousel>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { getLiveAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SkeletonCard } from "../SkeletonLoader";
import useEmblaCarousel from "embla-carousel-react";
import { ItemCarousel } from "../ItemCarousel";

export function LiveAuctions() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["liveAuctions"],
    queryFn: () => getLiveAuctions(),
    staleTime: 0,
    refetchOnMount: true,
  });

  return (
    <ItemCarousel
      items={items}
      isLoading={isLoading}
      title="Live Auctions"
      description="Bid on active auctions"
      viewAllLink="/auctions"
    />
  );
}
