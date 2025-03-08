"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuctionQueries } from "./hooks/useAuctionQueries";
import { useAuctionMutations } from "./hooks/useAuctionMutations";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { userAtom } from "@/app/atom/userAtom";
import { ImageGallery } from "./components/ImageGallery";
import { AuctionDetails } from "./components/AuctionDetails";
import { BidHistory } from "./components/BidHistory";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Trophy } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ChatComponent from "./components/ChatComponents";
import { formatCurrency } from "./utils/formatters";
import { createClientSupabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import AuthModalV2 from "@/app/components/AuthModalV2";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { updateItemStatusToEndedAction } from "./actions";

export default function AuctionItem({
  item,
  allBids,
  userId,
  hasAcknowledgedBid,
  isLoadingBids,
  onBidAcknowledge,
}: {
  item: any;
  allBids: any[];
  userId: string;
  hasAcknowledgedBid: boolean;
  isLoadingBids?: boolean;
  onBidAcknowledge: () => void;
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showBuyItNowModal, setShowBuyItNowModal] = useState(false);
  const [isAuthModalsOpen, setIsAuthModalsOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<
    "log-in" | "sign-up" | "forgot-password"
  >("log-in");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Added state
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [currentTab, setCurrentTab] = useState("history");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [showBinDisclaimerModal, setShowBinDisclaimerModal] = useState(false);
  const [showBinWinnerModal, setShowBinWinnerModal] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [user] = useAtom(userAtom);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  console.log("item", item);
  const isBidOver = new Date(item.endDate) < new Date() || item.isBoughtOut;

  // Check BIN winner first, then auction winner if not bought out
  const isWinner = item.isBoughtOut
    ? item.winnerId === userId // If bought out, only winnerId matters
    : bids.length > 0 && bids[0].userId === userId; // If not bought out, check highest bidder

  const isOwner = item.users.id === userId;

  console.log("item fuh", item);
  const {
    updateBidAcknowledgment,
    submitBid,
    isBidPending,
    submitBuyItNow,
    isBuyItNowPending,
    createOrder,
  } = useAuctionMutations(
    item.id,
    userId,
    onBidAcknowledge,
    item,
    setShowDisclaimerModal,
    highestBid!
  );

  useEffect(() => {
    setHighestBid(item.currentBid);
    setBids(allBids);
  }, [item.currentBid, allBids]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClientSupabase();

    // Fetch initial messages
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from("chatMessages")
          .select("*")
          .eq("itemId", Number(item.id))
          .order("createdAt", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    // Setup real-time subscription
    const channel = supabase
      .channel(`room:${item.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chatMessages",
          filter: `itemId=eq.${Number(item.id)}`,
        },
        (payload: any) => {
          const newMessage = payload.new as any;
          setMessages((current) => {
            const isDuplicate = current.some((msg) => msg.id === newMessage.id);
            if (isDuplicate) return current;
            return [...current, newMessage];
          });
          if (newMessage.userId !== userId && currentTab !== "chat") {
            setHasNewMessage(true);
            setUnreadMessageCount((prev) => Math.min(prev + 1, 99));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.id, userId, currentTab]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === "chat") {
      setHasNewMessage(false);
      setUnreadMessageCount(0);
    }
  };

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) return;
    setIsNavigating(true);
    await router.push(path);
  };

  const handleBidSubmit = async () => {
    if (!userId) {
      setIsAuthModalsOpen(true);
      return;
    }

    if (!hasAcknowledgedBid) {
      setShowDisclaimerModal(true);
      return;
    }
    submitBid();
  };

  const handleBuyItNowSubmit = async () => {
    if (!userId) {
      setIsAuthModalsOpen(true);
      return;
    }

    submitBuyItNow();
  };

  const handleBuyItNowConfirm = () => {
    setShowBuyItNowModal(false);
    setShowWinnerModal(true);
    // updateItemStatusMutate();
  };

  const handleDisclaimerConfirm = () => {
    updateBidAcknowledgment();
  };

  const handleAuctionEnd = useCallback(() => {
    if (bids.length === 0) {
      updateItemStatusToEndedAction(item.id);
      setShowWinnerModal(true);
      return;
    }

    if (isWinner && !item.isBoughtOut) {
      createOrder();
      setShowWinnerModal(true);
    } else {
      setShowWinnerModal(true);
    }
  }, [isWinner, item.isBoughtOut, createOrder, bids.length, item.id]);

  const handleCheckout = () => {
    navigateToCheckout();
  };

  const navigateToCheckout = () => {
    router.push(`/checkout/${item.id}`);
  };

  const handleBinClick = () => {
    if (!userId) {
      setAuthModalView("log-in");
      setIsAuthModalsOpen(true);
      return;
    }
    setShowBinDisclaimerModal(true);
  };

  const handleBinDisclaimerConfirm = () => {
    setShowBinDisclaimerModal(false);
    submitBuyItNow();
  };

  const handleCloseDialog = useCallback(() => {
    setShowWinnerModal(false);
    // Invalidate and refetch item data
    queryClient.invalidateQueries({ queryKey: ["item", item.id] });
  }, [item.id, queryClient]);

  return (
    <div className="container w-full px-4 py-8 md:py-12 overflow-x-hidden">
      <Dialog open={isNavigating} modal>
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Toaster position="bottom-right" reverseOrder={false} /> */}

      {item.status !== "LIVE" ? (
        <div className="mb-6 bg-gray-50 border-l-4 border-gray-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                Auction Ended
              </h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  This auction has ended. You can view the final results but new
                  bids can no longer be placed. Check out other active auctions
                  to continue bidding.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                For the Best Bidding Experience
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  To ensure you don't miss any crucial updates about your bid
                  status, we recommend staying on this page until the auction
                  ends. Real-time bid information is only available while
                  viewing this auction page.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <ImageGallery
          images={item.images.map((img: { publicId: string }) => img.publicId)}
        />
        <AuctionDetails
          item={item}
          highestBid={highestBid!}
          bids={bids}
          isOwner={isOwner}
          isBidOver={isBidOver}
          isWinner={isWinner}
          handleBidSubmit={handleBidSubmit}
          handleBuyItNowSubmit={handleBuyItNowSubmit}
          handleBinClick={handleBinClick}
          isPending={isBidPending}
          isBuyItNowPending={isBuyItNowPending}
          handleAuctionEnd={handleAuctionEnd}
          handleLinkClick={handleLinkClick}
          isDescriptionExpanded={isDescriptionExpanded}
          setIsDescriptionExpanded={setIsDescriptionExpanded}
          setShowBuyItNowModal={setShowBuyItNowModal}
        />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <Tabs
            defaultValue="history"
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Bid History</TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={isBidOver}
                className="relative"
              >
                Live Chat
                {hasNewMessage && currentTab !== "chat" && (
                  <Badge
                    className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0"
                    variant="destructive"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unreadMessageCount}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {unreadMessageCount > 10 ? "10+" : unreadMessageCount}
                      </motion.span>
                    </AnimatePresence>
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              {isLoadingBids ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">
                    Loading bid history...
                  </span>
                </div>
              ) : (
                <BidHistory bids={bids} handleLinkClick={handleLinkClick} />
              )}
            </TabsContent>
            <TabsContent value="chat">
              {userId ? (
                <ChatComponent
                  itemId={item.id}
                  userId={userId}
                  userName={user?.name || "Anonymous"}
                  isActive={!isBidOver}
                  itemOwnerId={item.users.id}
                  existingMessages={messages}
                  isLoadingMessages={isLoadingMessages}
                />
              ) : (
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

      <Dialog open={showBuyItNowModal} onOpenChange={setShowBuyItNowModal}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Important Notice About Buy It Now</DialogTitle>
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
              onClick={() => setShowBuyItNowModal(false)}
              disabled={isBidPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuyItNowConfirm}
              disabled={isBuyItNowPending}
            >
              {isBuyItNowPending ? (
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
              disabled={isBidPending}
            >
              Cancel
            </Button>
            <Button onClick={handleDisclaimerConfirm} disabled={isBidPending}>
              {isBidPending ? (
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

      <Dialog
        open={showBinDisclaimerModal}
        onOpenChange={setShowBinDisclaimerModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Instant Purchase Confirmation
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-xl font-semibold text-center">
                {formatCurrency(item.binPrice)}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Please confirm that:</h4>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>This is a final sale at the shown price</li>
                <li>The auction will end immediately</li>
                <li>You agree to complete the purchase</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBinDisclaimerModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBinDisclaimerConfirm}
              disabled={isBuyItNowPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isBuyItNowPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={showBinWinnerModal} onOpenChange={setShowBinWinnerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Purchase Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="font-semibold text-green-700">Congratulations!</h3>
              <p className="text-green-600">
                You have successfully purchased {item.name} for{" "}
                {formatCurrency(item.binPrice)}
              </p>
            </div>
            <p className="text-center text-muted-foreground">
              Please proceed to checkout to complete your purchase
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => router.push(`/checkout/${item.id}`)}
              disabled={isUpdatingBINItem}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUpdatingBINItem ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Checkout...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <Dialog
        open={showWinnerModal}
        onOpenChange={(open) => {
          // Only allow closing if we're not in the middle of creating an order
          if (!isCreatingOrder) {
            setShowWinnerModal(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            {isWinner ? (
              <WinnerDialog
                setShowWinnerModal={handleCloseDialog}
                item={item}
                highestBid={highestBid!}
                handleCheckout={handleCheckout}
                isCreatingOrder={isCreatingOrder}
              />
            ) : bids.length > 0 ? (
              <LoserDialog
                setShowWinnerModal={handleCloseDialog}
                latestBidderName={
                  item.isBoughtOut ? "another buyer" : bids[0].users.name
                }
                finalPrice={item.isBoughtOut ? item.binPrice : item.currentBid}
              />
            ) : (
              <NoWinnerDialog setShowWinnerModal={handleCloseDialog} />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* <AuthModals
        isOpen={isAuthModalsOpen}
        setIsOpen={setIsAuthModalsOpen}
        view={authModalView}
        setView={setAuthModalView}
      /> */}
      <AuthModalV2 isOpen={isAuthModalsOpen} setIsOpen={setIsAuthModalsOpen} />
    </div>
  );
}

function WinnerDialog({
  setShowWinnerModal,
  item,
  highestBid,
  handleCheckout,
  isCreatingOrder,
}: {
  setShowWinnerModal: React.Dispatch<React.SetStateAction<boolean>>;
  item: any;
  highestBid: number;
  handleCheckout: () => void;
  isCreatingOrder: boolean;
}) {
  const finalPrice = item.isBoughtOut ? item.binPrice : highestBid;
  const buyersPremium = finalPrice * 0.06;
  const shippingCost = item.dealingMethodType === "SHIPPED" ? 10 : 0; // Example shipping cost
  const totalCost = finalPrice + buyersPremium + shippingCost;

  return (
    <>
      <DialogHeader>
        <div className="text-center">
          <DialogTitle className="text-2xl font-bold text-green-700">
            Congratulations!
          </DialogTitle>
        </div>
      </DialogHeader>
      <Card className="border-none bg-green-50">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-green-800">
              You&apos;ve won this auction!
            </h3>
            <p className="text-green-700">
              You won <span className="font-semibold">{item.name}</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Final Sold Price:</span>
              <span className="font-semibold">
                {formatCurrency(finalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Buyer&apos;s Premium (6%):</span>
              <span className="font-semibold">
                {formatCurrency(buyersPremium)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-bold">
              <span className="text-gray-700">Total:</span>
              {item.dealingMethodType === "SHIPPING" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-green-700 flex items-center">
                        {formatCurrency(finalPrice + buyersPremium)}
                        <AlertCircle className="ml-1 h-4 w-4 text-gray-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not including shipping cost.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-green-700">
                  {formatCurrency(totalCost)}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p>
              An order has been created for this item. For more details about
              your purchase, including payment and{" "}
              {item.dealingMethodType === "SHIPPING" ? "shipping" : "pickup"}{" "}
              information, please proceed to the checkout page.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90"
          onClick={handleCheckout}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
        {/* <Button variant="outline" onClick={() => setShowWinnerModal(false)}>
          Close
        </Button> */}
      </div>
    </>
  );
}

function LoserDialog({
  setShowWinnerModal,
  latestBidderName,
  finalPrice,
}: {
  setShowWinnerModal: React.Dispatch<React.SetStateAction<boolean>>;
  latestBidderName: string;
  finalPrice: number;
}) {
  return (
    <>
      <DialogHeader>
        <div className="text-center">
          <DialogTitle className="text-2xl font-bold text-blue-700">
            Auction Ended
          </DialogTitle>
        </div>
      </DialogHeader>
      <Card className="border-none bg-blue-50">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-blue-800">
              This auction has ended
            </h3>
            <p className="text-blue-700">
              The winning bid was by{" "}
              <span className="font-semibold">{latestBidderName}</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-base font-bold">
              <span className="text-gray-700">Final Price:</span>
              <span className="text-blue-700">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-100 p-4 text-sm text-blue-700">
            <p>Better luck next time! Check out our other active auctions.</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={() => setShowWinnerModal(false)}>
          Close
        </Button>
      </div>
    </>
  );
}

function NoWinnerDialog({
  setShowWinnerModal,
}: {
  setShowWinnerModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <DialogHeader>
        <div className="text-center">
          <DialogTitle className="text-2xl font-bold text-red-700">
            Auction Ended
          </DialogTitle>
        </div>
      </DialogHeader>
      <Card className="border-none bg-red-50">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-red-800">
              No winner for this auction
            </h3>
            <p className="text-red-700">
              Unfortunately, this auction has ended without a winner.
            </p>
          </div>

          <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
            <p>Please check out our other active auctions.</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="default" onClick={() => setShowWinnerModal(false)}>
          Close
        </Button>
      </div>
    </>
  );
}
