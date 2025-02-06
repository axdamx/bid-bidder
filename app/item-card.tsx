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

interface ItemCardProps {
  item: ItemWithUser;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
              {item.user.name}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {isItemEnded ? "Final Bid" : "Current Bid"}
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(item.currentBid)}
              </p>
            </div>
          </div>
        </CardContent>
        <div className="mt-auto p-4 pt-0">
          <div className="text-center mb-4">
            {!isItemEnded && (
              <p className="text-sm text-muted-foreground mb-1">Ends in</p>
            )}
            <CountdownTimer endDate={item.endDate} isOver={isItemEnded} />
          </div>
          <Button
            asChild
            className="w-full"
            variant={isItemEnded ? "secondary" : "default"}
          >
            <Link
              href={`/items/${item.id}`}
              onClick={(e) => handleLinkClick(e, `/items/${item.id}`)}
            >
              {isItemEnded ? "View Details" : "Enter Listing"}
            </Link>
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ItemCard;
