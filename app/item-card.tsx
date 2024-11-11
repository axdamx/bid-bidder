"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Item } from "@/src/db/schema";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import { Clock, User } from "lucide-react";
import { ItemWithUser, User as UserType } from "./items";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: ItemWithUser;
  user?: UserType;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, user }) => {
  function isBidOver(item: Item) {
    return item.endDate < new Date();
  }

  function formatCurrency(value: number) {
    const absValue = Math.abs(value);
    let formattedValue;

    if (absValue >= 1e6) {
      formattedValue = (value / 1e6).toFixed(2) + "M";
    } else if (absValue >= 1e3) {
      formattedValue = (value / 1e3).toFixed(2) + "K";
    } else {
      formattedValue = value.toFixed(2);
    }

    return `RM${formattedValue}`;
  }

  return (
    <Card className="w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          {item.imageId && (
            <CldImage
              width="400"
              height="300"
              src={item.imageId}
              alt={item.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
          <Badge
            variant={isBidOver(item) ? "destructive" : "default"}
            className="absolute top-2 right-2"
          >
            {isBidOver(item) ? "Ended" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {item.name}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground shrink-0">
            <User className="w-4 h-4 mr-1" />
            {item.user.name}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {isBidOver(item) ? "Final Bid" : "Current Bid"}
            </p>
            <p className="text-lg font-bold">
              {formatCurrency(item.currentBid)}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          {!isBidOver(item) && (
            <p className="text-sm text-muted-foreground mb-1">Ends in</p>
          )}
          <CountdownTimer endDate={item.endDate} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full"
          variant={isBidOver(item) ? "secondary" : "default"}
        >
          <Link href={`/items/${item.id}`}>
            {isBidOver(item) ? "View Details" : "Place Bid"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
