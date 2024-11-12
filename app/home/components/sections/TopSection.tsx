"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FastAverageColor } from "fast-average-color";
import { CldImage } from "next-cloudinary";

interface TopBid {
  id: string;
  imageId: string;
  name: string;
  currentBid: string;
  timeLeft: string;
}

export function TopBidsClient({ initialItems }: { initialItems: TopBid[] }) {
  const [backgroundColor, setBackgroundColor] = useState("rgb(243, 244, 246)");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Example data - replace with your actual data
  //   const topBids: TopBid[] =

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.src = initialItems[currentIndex].imageId;

    img.onload = async () => {
      const color = await fac.getColor(img);
      setBackgroundColor(
        `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.1)`
      );
    };
  }, [currentIndex]);

  return (
    <div style={{ backgroundColor }} className="transition-colors duration-500">
      <div className="container px-4 md:px-6 py-12">
        <div className="relative overflow-hidden">
          <div className="flex gap-6">
            {initialItems.slice(0, 3).map((bid, index) => (
              <motion.div
                key={bid.id}
                className="w-full min-w-[300px] md:min-w-[400px] rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="aspect-square relative">
                  <CldImage
                    src={bid.imageId}
                    alt={bid.name}
                    className="object-cover w-full h-full"
                    height={80}
                    width={80}
                  />
                </div>
                <div className="p-4 bg-background/80 backdrop-blur-sm">
                  <h3 className="font-bold text-lg">{bid.name}</h3>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Bid
                      </p>
                      <p className="font-medium">{bid.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Ending in</p>
                      <p className="font-medium">{bid.timeLeft}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
