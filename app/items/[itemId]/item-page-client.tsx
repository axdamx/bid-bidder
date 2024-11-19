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
  checkExistingOrder,
  createBidAction,
  createOrderAction,
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
import AuthModals from "@/app/components/AuthModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatComponent from "./components/ChatComponents";
import { useSupabase } from "@/app/context/SupabaseContext";
import { getUserById } from "@/app/action";
import ChatComponentV2 from "./components/ChatComponentsV2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClientSupabase } from "@/lib/supabase/client";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

// export function formatTimestamp(timestamp: string) {
//   return formatDistance(new Date(), timestamp, { addSuffix: true });
// }
export function formatTimestamp(timestamp: string) {
  const now = new Date();
  // Convert timestamp to local timezone by explicitly creating a UTC date
  const date = new Date(timestamp + "Z"); // Adding 'Z' to indicate UTC
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  return formatDistance(date, now, {
    addSuffix: true,
    includeSeconds: true,
  });
}

function formatCurrency(value: number) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return formattedValue;
}
type ModalView = "log-in" | "sign-up" | "forgot-password";
export default function AuctionItem({
  item,
  allBids,
  userId,
  hasAcknowledgedBid,
  onBidAcknowledge,
}: {
  item: any;
  allBids: any[];
  userId: string;
  hasAcknowledgedBid: boolean;
  onBidAcknowledge: () => void;
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
  const [isAuthModalsOpen, setIsAuthModalsOpen] = useState(false); // State to control AuthModals
  const [authModalView, setAuthModalView] = useState<ModalView>("log-in");
  // const [currentUserData, setCurrentUserData] = useState(null);
  const router = useRouter();

  // const { session } = useSupabase();
  // const currentSessionUserId = session?.user?.id;
  const [user] = useAtom(userAtom); // winner id

  const images = item.images.map((img: { publicId: string }) => img.publicId);
  const latestBidderName = bids.length > 0 && bids[0].users.name;
  const isWinner = bids.length > 0 && bids[0].userId === userId;
  const slides = images.map((publicId: string) => ({
    src: `https://res.cloudinary.com/dmqhabag1/image/upload/${publicId}`,
  }));

  const hasBids = bids.length > 0;
  const isBidOver = new Date(item.endDate + "Z") < new Date();

  // const supabase = createClientSupabase();
  // console.log("whats good, supabase", supabase);

  // useEffect(() => {
  //   async function fetchUserData() {
  //     try {
  //       const fetchedUser = await getUserById(currentSessionUserId);
  //       setCurrentUserData(fetchedUser);
  //     } catch (err) {
  //       // setError(err);
  //     }
  //   }

  //   if (currentSessionUserId) {
  //     fetchUserData();
  //   }
  // }, [currentSessionUserId]);
  const { data: currentUserData } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserById(user?.id || ""),
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  console.log("current User Id", currentUserData);

  const handleBidSubmit = async () => {
    if (!userId) {
      setIsAuthModalsOpen(true); // Open the AuthModals
      return;
    }

    if (!hasAcknowledgedBid) {
      setShowDisclaimerModal(true);
      return;
    }
    submitBid();
  };

  // const { mutate: updateBidAcknowledgment } = useMutation({
  //   mutationFn: () => updateBidAcknowledgmentAction(item.id, userId),
  //   onError: () => {
  //     toast.error("Failed to acknowledge bid");
  //   },
  // });
  const { mutate: updateBidAcknowledgment } = useMutation({
    mutationFn: () => updateBidAcknowledgmentAction(item.id, userId),
    onSuccess: () => {
      // Parent will handle query invalidation via onBidAcknowledge
      onBidAcknowledge();

      // Continue with bid submission and UI updates
      submitBid();
      setShowDisclaimerModal(false);
    },
    onError: () => {
      toast.error("Failed to acknowledge bid");
    },
  });

  const { mutate: createOrder } = useMutation({
    mutationFn: () =>
      createOrderAction(item.id, userId, highestBid!, item.itemUser.id),
    onError: (error) => {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order. Please contact support.");
    },
  });

  const handleDisclaimerConfirm = () => {
    updateBidAcknowledgment();
  };

  const { mutate: submitBid } = useMutation({
    mutationFn: async () => {
      await createBidAction(item.id, userId);
    },
    onError: (error) => {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    },
  });

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNewBid = useCallback((newBid: any) => {
    setHighestBid(newBid.newBid);
    setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
    toast.success(
      `New bid received: ${formatCurrency(newBid.newBid)} by ${
        newBid.bidInfo.users.name
      }`
    );
  }, []);

  const handleAuctionEnd = useCallback(() => {
    // Only attempt to create order if there are bids and current user is the winner
    if (bids.length > 0 && bids[0].userId === userId) {
      // Use React Query to handle the order creation
      createOrder();
    }

    setShowWinnerModal(true);
  }, [bids, userId, item.id, highestBid]);

  const { data: orderExists } = useQuery({
    queryKey: ["order", item.id, userId],
    queryFn: () => checkExistingOrder(item.id, userId),
    enabled: !!userId && isBidOver && isWinner, // Only run query if user is winner and auction is over
  });

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

  useEffect(() => {
    if (isBidOver && !hasBids) {
      setShowWinnerModal(true);
    }
  }, [isBidOver, hasBids]);

  const NoWinnerDialog = () => (
    <>
      <DialogTitle className="flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-red-500" />
        Auction Ended
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-red-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-red-700">No bids were placed</h1>
          <h1 className="text-sm text-red-600 mt-2">
            Unfortunately, this auction ended without any bids.
          </h1>
          <h1 className="text-sm text-red-600 mt-2">
            Please check out our other active auctions.
          </h1>
        </div>
      </DialogDescription>
    </>
  );
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
        </div>
        <div className="text-center justify-center">
          {orderExists ? (
            <Button
              type="button"
              className="mt-8"
              onClick={() => {
                // Add navigation to order page or other action
                router.push("/dashboard?tab=orders");
              }}
            >
              View Order
            </Button>
          ) : (
            <form action={async () => await updateItemStatus(item.id, userId)}>
              <Button type="submit" className="mt-8">
                Proceed to Checkout
              </Button>
            </form>
          )}
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
    <div className="container w-full px-4 py-8 md:py-12 overflow-x-hidden">
      <Toaster
        toastOptions={{ duration: 3000 }}
        position="bottom-right"
        reverseOrder={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
        <div className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader className="space-y-2">
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
                <CardTitle className="text-xl md:text-2xl font-bold break-words">
                  {item.name}
                </CardTitle>
              </div>
              <CardDescription className="text-base md:text-lg">
                Created by:{" "}
                <Link
                  href={`/profile/${item.itemUser.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  {item.itemUser.name}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12">
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="break-words">
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(highestBid ?? 0)}
                  </p>
                </div>
                <div className="break-words">
                  <p className="text-sm text-muted-foreground">Bid Interval</p>
                  <p className="text-lg">{formatCurrency(item.bidInterval)}</p>
                </div>
                <div className="break-words">
                  <p className="text-sm text-muted-foreground">
                    Starting Price
                  </p>
                  <p className="text-lg">
                    {formatCurrency(item.startingPrice)}
                  </p>
                </div>
                <div className="break-words">
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="text-lg">{bids.length}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div
                  className={cn(
                    "text-muted-foreground relative",
                    !isDescriptionExpanded &&
                      item.description.length > 500 &&
                      "max-h-[240px] overflow-hidden" // ~10 lines at ~50 chars per line
                  )}
                  style={{ overflowWrap: "break-word" }}
                >
                  <p>{item.description}</p>
                  {!isDescriptionExpanded && item.description.length > 500 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                {item.description.length > 500 && (
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
              <CountdownTimer
                endDate={item.endDate}
                onExpire={handleAuctionEnd}
                className="text-sm"
              />
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isWinner ? (
                    "You are currently winning this bid!"
                  ) : (
                    "Place Bid"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent className="[&>button]:hidden">
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
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Bid History</TabsTrigger>
              <TabsTrigger value="chat" disabled={isBidOver}>
                Live Chat
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <div className="overflow-x-auto">
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
                            <TableCell>{bid.users.name}</TableCell>
                            <TableCell>{formatCurrency(bid.amount)}</TableCell>
                            <TableCell>
                              {formatTimestamp(bid.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="p-4">No bids yet.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="chat">
              {userId ? (
                <ChatComponent
                  itemId={item.id}
                  userId={userId}
                  userName={currentUserData?.name} // Or however you get the current user's name
                  itemOwnerId={item.itemUser.id}
                />
              ) : (
                // <ChatComponentV2
                //   itemId={item.id}
                //   userId={userId}
                //   userName={currentUserData?.name} // Or however you get the current user's name
                // />
                <div className="text-center py-4">
                  <p>Please log in to participate in the chat</p>
                  <Button
                    onClick={() => setIsAuthModalsOpen(true)}
                    className="mt-2"
                  >
                    Log In
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Winner/Loser Dialog */}
      <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {isWinner ? (
              <WinnerDialog />
            ) : hasBids ? (
              <LoserDialog />
            ) : (
              <NoWinnerDialog />
            )}
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowWinnerModal(false)} className="mt-2">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModals
        isOpen={isAuthModalsOpen}
        setIsOpen={setIsAuthModalsOpen}
        view={authModalView}
        setView={setAuthModalView}
      />
    </div>
  );
}
