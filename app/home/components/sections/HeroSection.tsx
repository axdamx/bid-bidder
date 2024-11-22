"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "react-countup";

const AnimatedNumber = ({
  end,
  suffix = "k+",
}: {
  end: number;
  suffix?: string;
}) => {
  const countUpRef = useRef(null);
  const [stage, setStage] = useState<"initial" | "loop">("initial");

  const { update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: 10,
    duration: 2,
    suffix,
    separator: ",",
  });

  useEffect(() => {
    if (stage === "initial") {
      const timer = setTimeout(() => {
        update(end);
        setStage("loop");
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (stage === "loop") {
      const interval = setInterval(() => {
        update(100);
        setTimeout(() => update(end), 2000);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [stage, end, update]);

  return <span ref={countUpRef} />;
};

const HeroSection = () => {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-150 flex rounded-xl mt-8">
      <div className="mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
              Discover the{" "}
              <span className="relative">
                largest
                <span className="absolute bottom-1 left-0 w-full h-[0.2em] bg-red-200 -z-10"></span>
              </span>{" "}
              auction marketplace
              <br />
              with exclusive, rare finds
              <br />
              waiting for your bid
            </h1>
            <p className="text-gray-600 text-lg">
              Unique collectibles and digital assets, all just a bid away
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              Explore
            </Button>
            <Button variant="ghost" className="gap-2">
              Learn more <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-red-500">
                <AnimatedNumber end={50} />
              </p>
              <p className="text-gray-600">Artwork</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                <AnimatedNumber end={30} />
              </p>
              <p className="text-gray-600">Artist</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                <AnimatedNumber end={20} />
              </p>
              <p className="text-gray-600">Auction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
