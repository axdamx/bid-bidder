"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
// import { useEmblaCarousel } from '@/components/ui/carousel'
import AutoPlay from "embla-carousel-autoplay";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";

// Define category type
type Category = {
  id: number;
  name: string;
  image: string;
  slug: string;
};

// Categories data
const categories: Category[] = [
  {
    id: 1,
    name: "Sports",
    image: "/placeholder.svg?height=400&width=600",
    slug: "sports",
  },
  {
    id: 2,
    name: "Accessories",
    image: "/placeholder.svg?height=400&width=600",
    slug: "accessories",
  },
  {
    id: 3,
    name: "Streetwear",
    image: "/placeholder.svg?height=400&width=600",
    slug: "streetwear",
  },
  {
    id: 4,
    name: "Cars",
    image: "/placeholder.svg?height=400&width=600",
    slug: "cars",
  },
  {
    id: 5,
    name: "Properties",
    image: "/placeholder.svg?height=400&width=600",
    slug: "properties",
  },
  {
    id: 6,
    name: "Others",
    image: "/placeholder.svg?height=400&width=600",
    slug: "others",
  },
];

// Memoized CategoryCard component
const CategoryCard = React.memo(
  ({ category, onClick }: { category: Category; onClick: () => void }) => (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-48">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </CardFooter>
    </Card>
  )
);

CategoryCard.displayName = "CategoryCard";

export default function OptimizedCategoriesCarousel() {
  const router = useRouter();
  const [items, setItems] = useState<Category[]>([]);
  const [api] = useEmblaCarousel(
    {
      //   loop: true,
      align: "start",
      skipSnaps: false,
    }
    // [AutoPlay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]
  );

  useEffect(() => {
    // Initialize with 3 sets of categories for smooth infinite scrolling
    setItems([...categories, ...categories, ...categories]);
  }, []);

  const handleCategoryClick = useCallback(
    (slug: string) => {
      router.push(`/category/${slug}`);
    },
    [router]
  );

  return (
    <section className="w-full py-12">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Browse Categories
        </h2>
        <div className="relative">
          <Carousel
            opts={{
              loop: true,
              align: "start",
              skipSnaps: false,
              //   speed: 50, // Increased speed for slower scrolling
            }}
            plugins={
              [
                //   AutoPlay({
                //     delay: 1500,
                //     stopOnInteraction: false,
                //     playOnInit: true,
                //   }),
              ]
            }
          >
            <CarouselContent
              ref={api}
              // className="transition-transform duration-[2000ms] ease-linear"
            >
              {items.map((category, index) => (
                <CarouselItem
                  key={`${category.id}-${index}`}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <CategoryCard
                    category={category}
                    onClick={() => handleCategoryClick(category.slug)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
