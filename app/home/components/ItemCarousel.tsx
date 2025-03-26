"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ItemCard from "@/app/item-card";
import { SkeletonCard } from "@/app/home/components/SkeletonLoader";
import useEmblaCarousel from "embla-carousel-react";
import { MotionGrid } from "@/app/components/motionGrid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ItemWithUser } from "@/app/items";

interface Item {
  id: string;
  userId: string;
  name: string;
  currentBid: number;
  startingPrice: number;
  imageId: string | null;
  bidInterval: number;
  endDate: Date;
  description: string | null;
  status: string | null;
  winnerId: string | null;
  isBoughtOut?: boolean;
}

interface ItemCarouselProps {
  items: ItemWithUser[];
  isLoading: boolean;
  title: string;
  description: string;
  viewAllLink: string;
  totalCount?: number;
}

export function ItemCarousel({
  items,
  isLoading,
  title,
  description,
  viewAllLink,
  totalCount,
}: ItemCarouselProps) {
  const [api] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
  });

  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Add this effect to reset navigation state when pathname changes
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

  return (
    <>
      <Dialog open={isNavigating} modal>
        <DialogTitle className="[&>button]:hidden" />
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <div className="">
          <Carousel
            opts={{
              loop: false,
              align: "start",
              skipSnaps: false,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  {title} ({totalCount ?? items.length})
                </h2>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
              {/* <Link
              href={`/auctions?type=${viewAllLink}`}
              className="text-primary hover:text-primary/80"
              onClick={(e) =>
                handleLinkClick(e, `/auctions?type=${viewAllLink}`)
              }
            >
              View all →
            </Link> */}
              <div className="flex gap-2">
                <CarouselPrevious className="relative left-0 translate-y-0" />
                <CarouselNext className="relative right-0 translate-y-0" />
              </div>
            </div>

            <div className="relative">
              {/* <Carousel
              opts={{
                loop: false,
                align: "start",
                skipSnaps: false,
              }}
            > */}
              <CarouselContent ref={api}>
                {isLoading ? (
                  <CarouselItem className="w-full pl-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                      {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} />
                      ))}
                    </div>
                  </CarouselItem>
                ) : (
                  <>
                    {items.map((item, index) => (
                      <CarouselItem
                        key={item.id}
                        className="basis-full md:basis-1/6 pl-4"
                      >
                        <MotionGrid
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.125 }}
                        >
                          <ItemCard item={item} />
                        </MotionGrid>
                      </CarouselItem>
                    ))}
                    <CarouselItem className="basis-full md:basis-1/6 pl-4">
                      <div className="h-full">
                        <MotionGrid
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: items.length * 0.1 }}
                          className="h-full flex"
                        >
                          <Link
                            href={`/app/auctions?type=${viewAllLink}`}
                            onClick={(e) =>
                              handleLinkClick(
                                e,
                                `/app/auctions?type=${viewAllLink}`
                              )
                            }
                            className="w-full flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors text-center"
                          >
                            <div className="items-center">
                              <h3 className="text-xl font-semibold mb-2">
                                View All {title}
                              </h3>
                              <p className="text-muted-foreground">
                                Discover more {description.toLowerCase()}
                              </p>
                              <span className="mt-4 text-3xl">→</span>
                            </div>
                          </Link>
                        </MotionGrid>
                      </div>
                    </CarouselItem>
                  </>
                )}
              </CarouselContent>
            </div>
            {/* <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" /> */}
          </Carousel>
        </div>
      </div>
    </>
  );
}
