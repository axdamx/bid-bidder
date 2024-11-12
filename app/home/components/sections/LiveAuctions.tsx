"use client"; // Add this at the top

import { getLiveAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LiveAuctions() {
  // Remove async
  // Change to use client-side data fetching or pass data as props
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLiveAuctions()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live auctions:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="w-full">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Live Auctions</h2>
            <p className="text-muted-foreground mt-1">Bid on active auctions</p>
          </div>
          <a href="/auctions" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div>
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
      </div>
    </section>
  );
}
