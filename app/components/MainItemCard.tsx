"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedImage } from "./OptimizedImage";

interface CountdownProps {
  targetDate: Date;
}

function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums">
            {value.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground uppercase">{key}</span>
        </div>
      ))}
    </div>
  );
}

interface AuctionCardProps {
  image?: string;
  title?: string;
  seller?: string;
  currentBid?: string;
  isActive?: boolean;
  endDate?: Date;
}

export default function MainItemCard({
  image = "/placeholder.svg?height=400&width=600",
  title = "Pajero",
  seller = "Mohd Adam",
  currentBid = "RM155.00",
  isActive = true,
  endDate = new Date(Date.now() + 172800000), // 48 hours from now
}: AuctionCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative aspect-[16/9]">
        <OptimizedImage
          width={400}
          height={300}
          src={image}
          alt={title}
          className="object-cover w-full h-full"
          quality="eco"
        />
        {isActive && (
          <Badge className="absolute top-4 right-4" variant="secondary">
            Active
          </Badge>
        )}
      </div>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage alt={seller} />
              <AvatarFallback>{seller[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{seller}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Current Bid</div>
          <div className="text-3xl font-bold">{currentBid}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-2">Ends in</div>
          <CountdownTimer targetDate={endDate} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg">
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
}
