"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createBidAction,
  updateBidAcknowledgmentAction,
  updateItemStatus,
} from "./actions";
import { formatDistance } from "date-fns";
import { io } from "socket.io-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CountdownTimer from "@/app/countdown-timer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ItemImage from "./image-component";
import { CldImage } from "next-cloudinary";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function formatTimestamp(timestamp: Date) {
  return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
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

  return `${formattedValue} MYR`;
}

export default function AuctionItem({
  item,
  allBids,
  userId,
  hasAcknowledgedBid,
}: {
  item: any;
  allBids: any[];
  userId: string;
  hasAcknowledgedBid: boolean;
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [userCount, setUserCount] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  console.log("item", item);

  const handleBidSubmit = async () => {
    if (!hasAcknowledgedBid) {
      setShowDisclaimerModal(true);
      return;
    }
    await submitBid();
  };

  const handleDisclaimerConfirm = async () => {
    try {
      setIsSubmitting(true);
      await updateBidAcknowledgmentAction(item.id);
      await submitBid();
      setShowDisclaimerModal(false);
    } catch (error) {
      toast.error("Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBid = async () => {
    try {
      await createBidAction(item.id);
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    }
  };
  const images = item.images.map((img: { publicId: string }) => img.publicId);
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Mock multiple images for the gallery
  const mockImages = [
    item.imageId,
    item.imageId,
    item.imageId,
    item.imageId,
    item.imageId,
  ];

  const prevUserCountRef = useRef(0);

  const handleNewBid = useCallback((newBid: any) => {
    setHighestBid(newBid.newBid);
    setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
    toast.success(
      `New bid: ${formatCurrency(newBid.newBid)} by ${newBid.bidInfo.user.name}`
    );
  }, []);

  const handleAuctionEnd = useCallback(() => {
    setShowWinnerModal(true);
  }, []);

  const latestBidderName = bids.length > 0 && bids[0].user.name;
  const isWinner = bids.length > 0 && bids[0].userId === userId;
  const slides = images.map((publicId: string) => ({
    src: `https://res.cloudinary.com/dmqhabag1/image/upload/${publicId}`,
  }));

  useEffect(() => {
    const socket = io("http://localhost:8082", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("joinItem", item.id);
    });

    socket.on("newBid", (newBid) => {
      console.log("Updating bid:", newBid);
      handleNewBid(newBid);
    });

    socket.on("userCount", (count) => {
      console.log("Connected users count:", count);
      setUserCount(count);
      // Show toast notification when a new user enters
      // if (count > prevUserCountRef.current) {
      //   toast("A new user has joined the auction");
      // }

      // // Update the ref and state
      // prevUserCountRef.current = count;
      // setUserCount(count);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.emit("leaveItem", item.id);
      socket.disconnect();
    };
  }, [handleNewBid, item.id]);

  useEffect(() => {
    setHighestBid(item.currentBid);
    setBids(allBids);
  }, [item.currentBid, allBids]);

  const hasBids = bids.length > 0;
  const isBidOver = item.endDate < new Date();

  const WinnerDialog = () => (
    <>
      <DialogTitle className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Congratulations! You Won!
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-green-700">
            You&apos;ve won this auction!
          </h1>
          <h1 className="text-sm text-green-600 mt-2">
            You won {item.name} with a final bid of{" "}
            {formatCurrency(item.currentBid)}
          </h1>
          <h1 className="text-sm text-green-600 mt-2">
            The seller will contact you soon with payment and delivery details.
          </h1>
          <form action={async () => await updateItemStatus(item.id, userId)}>
            <Button type="submit" className="mt-8">
              Proceed to Checkout
            </Button>
          </form>
        </div>
      </DialogDescription>
    </>
  );

  const LoserDialog = () => (
    <>
      <DialogTitle className="flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-blue-500" />
        Auction Ended
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-blue-700">This auction has ended</h1>
          <h1 className="text-sm text-blue-600 mt-2">
            The winning bid was {formatCurrency(item.currentBid)} by{" "}
            {latestBidderName}
          </h1>
          <h1 className="text-sm text-blue-600 mt-2">
            Better luck next time! Check out our other active auctions.
          </h1>
        </div>
      </DialogDescription>
    </>
  );

  return (
    <div className="container mx-auto py-12">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="cursor-pointer h-full" // Added h-full
            >
              <CldImage
                width="460"
                height="460"
                src={images[currentImageIndex]}
                alt="Description of my image"
                // className="rounded-xl gap-8" // Ensure the image covers the content area
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <Lightbox
              open={isLightboxOpen}
              close={() => setIsLightboxOpen(false)}
              slides={slides}
              index={currentImageIndex}
            />
            <div className="absolute bottom-4 right-4 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevImage}
                className="bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextImage}
                className="bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md",
                  currentImageIndex === index && "ring-2 ring-primary"
                )}
              >
                {/* <img
                  src={image}
                  alt={`${item.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                /> */}
                <CldImage
                  width="460"
                  height="400"
                  src={image}
                  alt="Description of my image"
                  // className="rounded-xl gap-8" // Ensure the image covers the content area
                  // className="w-full h-full object-cover rounded-lg"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
              <CardDescription className="text-lg">
                Created by:{" "}
                <Link
                  href={`/profile/${item.itemWithUser.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  {item.itemWithUser.name}
                </Link>
              </CardDescription> */}
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  {item.name}
                </CardTitle>
                <CountdownTimer
                  endDate={item.endDate}
                  onExpire={handleAuctionEnd}
                  className="text-sm"
                />
              </div>
              <CardDescription className="text-lg">
                Created by:{" "}
                <Link
                  href={`/profile/${item.itemWithUser.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  {item.itemWithUser.name}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(highestBid ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bid Interval</p>
                  <p className="text-lg">{formatCurrency(item.bidInterval)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Starting Price
                  </p>
                  <p className="text-lg">
                    {formatCurrency(item.startingPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="text-lg">{bids.length}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div
                  className={cn(
                    "text-muted-foreground relative",
                    !isDescriptionExpanded && "max-h-[150px] overflow-hidden"
                  )}
                >
                  <p>{item.description}</p>
                  {!isDescriptionExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                {item.description.length > 300 && (
                  <Button
                    variant="link"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="p-0 h-auto mt-2"
                  >
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                  </Button>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Connected users: {userCount}
                </p>
              </div>
              {/* <CountdownTimer
                endDate={item.endDate}
                onExpire={handleAuctionEnd}
              /> */}
              {/* {!isBidOver && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button className="w-full" disabled={isWinner}>
                    {isWinner
                      ? "You are currently winning this bid!"
                      : "Place Bid"}
                  </Button>
                </form>
              )} */}
              {!isBidOver && (
                <Button
                  className="w-full"
                  disabled={isWinner || isSubmitting}
                  onClick={handleBidSubmit}
                >
                  {isWinner
                    ? "You are currently winning this bid!"
                    : isSubmitting
                    ? "Processing..."
                    : "Place Bid"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Important Notice About Bidding</DialogTitle>
            <DialogDescription className="pt-4">
              By placing a bid, you are entering into a binding commitment to
              purchase the item if you win. Your bid represents a legal
              obligation to buy the item at the bid price if you are the winning
              bidder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisclaimerModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleDisclaimerConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "I Understand"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bid History Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          {hasBids ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder Name</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.slice(0, 10).map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.user.name}</TableCell>
                      <TableCell>{formatCurrency(bid.amount)}</TableCell>
                      <TableCell>{formatTimestamp(bid.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No bids yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Winner/Loser Dialog */}
      <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {isWinner ? <WinnerDialog /> : <LoserDialog />}
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowWinnerModal(false)} className="mt-2">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
