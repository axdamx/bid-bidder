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

interface Item {
  id: string;
  // ... other item properties
}

interface ItemCarouselProps {
  items: Item[];
  isLoading: boolean;
  title: string;
  description: string;
  viewAllLink: string;
}

export function ItemCarousel({
  items,
  isLoading,
  title,
  description,
  viewAllLink,
}: ItemCarouselProps) {
  const [api] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
  });

  return (
    <section className="w-full py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <a href={viewAllLink} className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              loop: false,
              align: "start",
              skipSnaps: false,
            }}
          >
            <CarouselContent ref={api}>
              {isLoading ? (
                <CarouselItem className="w-full pl-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                </CarouselItem>
              ) : (
                <>
                  {items.map((item, index) => (
                    <CarouselItem
                      key={item.id}
                      className="basis-full md:basis-1/3 pl-4"
                    >
                      <MotionGrid
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ItemCard item={item} />
                      </MotionGrid>
                    </CarouselItem>
                  ))}
                  <CarouselItem className="basis-full md:basis-1/3 pl-4">
                    <div className="h-full">
                      <MotionGrid
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: items.length * 0.1 }}
                        className="h-full flex"
                      >
                        <a
                          href={viewAllLink}
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
                        </a>
                      </MotionGrid>
                    </div>
                  </CarouselItem>
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
