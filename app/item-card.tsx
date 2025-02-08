"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import { ItemWithUser, User as UserType } from "./items";
import { formatCurrency } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { updateItemStatus } from "./action";
import { useQueryClient } from "@tanstack/react-query";

interface ItemCardProps {
  item: ItemWithUser;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Add this effect to reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    // Don't navigate if we're already on the target path
    if (path === pathname) {
      return;
    }
    setIsNavigating(true);
    router.push(path);
  };

  const handleAuctionEnd = async () => {
    // Update item status in the database
    await updateItemStatus(item.id, "ENDED");

    // Invalidate live auctions query to force a refresh
    queryClient.invalidateQueries({ queryKey: ["liveAuctions"] });
  };

  const isItemEnded = isBidOver(item.endDate);

  function isBidOver(endDate: Date) {
    return new Date(endDate) < new Date() || item.isBoughtOut;
  }

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

      <Card className="w-full h-full overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
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
            <Badge variant="secondary" className="absolute top-2 left-2">
              LOT #{item.id}
            </Badge>
            <Badge
              variant={isItemEnded ? "destructive" : "default"}
              className="absolute top-2 right-2"
            >
              {isItemEnded ? "Ended" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold break-words">
              {item.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground shrink-0">
              {item.user?.image ? (
                <Image
                  src={item.user.image}
                  width={16}
                  height={16}
                  alt={`${item.user.name}'s profile picture`}
                  className="w-4 h-4 mr-1 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 mr-1" />
              )}
              {item.user?.name}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">Current Bid</div>
            <div className="text-xl font-bold">
              {formatCurrency(item.currentBid)}
            </div>
          </div>
          {!isItemEnded && (
            <div className="mt-4">
              <CountdownTimer
                endDate={item.endDate}
                onExpire={handleAuctionEnd}
                isOver={isItemEnded}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            variant={isItemEnded ? "outline" : "default"}
            asChild
          >
            <Link
              href={`/items/${item.id}`}
              onClick={(e) => handleLinkClick(e, `/items/${item.id}`)}
            >
              {isItemEnded ? "View Details" : "Place Bid"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ItemCard;
