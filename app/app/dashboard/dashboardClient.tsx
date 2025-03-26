"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  HelpCircle,
  LogOut,
  LayoutGridIcon,
  List,
  Package,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import dynamic from "next/dynamic";

import {
  DashboardSkeleton,
  UserDetailsSkeleton,
  AddressSkeleton,
  PaymentSkeleton,
  OrdersSkeleton,
} from "./loading";

const UserDetailsPage = dynamic(() => import("./userdetails/userDetails"), {
  loading: () => <UserDetailsSkeleton />,
});

const Addresses = dynamic(() => import("./address/addressDetails"), {
  loading: () => <AddressSkeleton />,
});

const PaymentsAndPayouts = dynamic(() => import("./payment/paymentDetails"), {
  loading: () => <PaymentSkeleton />,
});

const OrderDetails = dynamic(() => import("./orders/ordersDetails"), {
  loading: () => <OrdersSkeleton />,
});

const HelpDetails = dynamic(() => import("./help/helpDetails"), {
  loading: () => <DashboardSkeleton />,
});

const ItemsDetails = dynamic(() => import("./items/itemsDetails"), {
  loading: () => <DashboardSkeleton />,
});

import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionGrid } from "@/app/components/motionGrid";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      // cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    },
  },
});

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
} | null;

interface DashboardClientProps {
  initialUser?: User;
}

const DashboardClient = ({ initialUser }: DashboardClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if we should show the hint (only on first visit)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hintShown = localStorage.getItem("sidebarHintShown");
      if (hintShown === "true") {
        setShowMobileHint(false);
      }
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(
    searchParams.get("tab") || (initialUser ? "userDetails" : "")
  );
  const [showMobileHint, setShowMobileHint] = useState(true);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveContent(tabId);
    // Use shallow routing to prevent full page refresh
    window.history.replaceState({}, "", `/app/dashboard?tab=${tabId}`);
  }, []);

  if (!initialUser) {
    return null;
  }

  const initials =
    initialUser?.name ||
    ""
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const navigation = [
    {
      name: "User Details",
      icon: User,
      id: "userDetails",
      description: "Manage your personal information and settings",
    },
    {
      name: "Address",
      icon: MapPin,
      id: "address",
      description: "Manage your shipping and billing addresses",
    },
    {
      name: "Payout Method",
      icon: CreditCard,
      id: "payment",
      description: "Handle your payment methods and transactions",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      id: "orders",
      description: "View and track your orders",
    },
    {
      name: "Items",
      icon: Package,
      id: "items",
      description: "Manage your items",
    },
    // {
    //   name: "Help",
    //   icon: HelpCircle,
    //   id: "help",
    //   description: "Get support and find answers to common questions",
    // },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case "userDetails":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">User Details</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <UserDetailsPage initialUser={initialUser} />
              </Card>
            </div>
          </MotionGrid>
        );
      case "address":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Address</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your shipping addresses
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={initialUser?.image || "/api/placeholder/64/64"}
                          alt={initialUser?.name || "User"}
                        />
                        <AvatarFallback>
                          {initialUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {initialUser?.name || "Guest"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {initialUser?.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent> */}
                <Addresses />
              </Card>
            </div>
          </MotionGrid>
        );
      case "payment":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Payout Methods</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your payout methods
                  </CardDescription>
                </CardHeader>
                <PaymentsAndPayouts />
              </Card>
            </div>
          </MotionGrid>
        );
      case "orders":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Order Details</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your orders
                  </CardDescription>
                </CardHeader>
                <OrderDetails />
              </Card>
            </div>
          </MotionGrid>
        );
      // case "help":
      //   return (
      //     <MotionGrid>
      //       <div className="p-2 sm:p-6">
      //         <Card>
      //           <CardHeader className="p-4">
      //             <CardTitle className="text-lg">Help</CardTitle>
      //             <CardDescription className="text-sm">
      //               Get support and find answers to common questions
      //             </CardDescription>
      //           </CardHeader>
      //           <HelpDetails />
      //         </Card>
      //       </div>
      //     </MotionGrid>
      //   );
      case "items":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Items</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your items
                  </CardDescription>
                </CardHeader>
                <ItemsDetails />
              </Card>
            </div>
          </MotionGrid>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{activeContent}</h2>
            <p>Content for {activeContent}</p>
          </div>
        );
    }
  };

  const sidebarVariants = {
    open: {
      width: "16rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      width: "4rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full rounded-xl">
      <div className="p-4 border-b">
        <div className="flex flex-col space-y-3">
          {/* User info row */}
          <div className="flex items-center gap-2 w-full">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={initialUser?.image} />
              <AvatarFallback>
                {initialUser?.name?.charAt(0) || initialUser?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 truncate"
              >
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">
                    {initialUser?.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs px-1.5 py-0 flex-shrink-0"
                  >
                    Basic
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {initialUser?.email}
                </p>
              </motion.div>
            )}
          </div>

          {/* Upgrade button row */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "w-full justify-center text-xs h-8",
                  !isSidebarOpen && "w-8 p-0"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isSidebarOpen && (
                  <span className="ml-1.5">Upgrade to Pro</span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-lg sm:text-xl [&>button]:hidden">
                  Premium Features
                </DialogTitle>
                <DialogDescription className="text-center">
                  Unlock premium features for both sellers and buyers
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Seller Benefits */}
                <div className="space-y-3 sm:space-y-4 border rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg text-center border-b pb-2">
                    For Sellers
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Up to 20 high-quality images</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Event auction capabilities</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Multiple listing management</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Advanced item tracking</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Boosted listing visibility</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Curated listing features</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">And more premium features</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Benefits */}
                <div className="space-y-3 sm:space-y-4 border rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg text-center border-b pb-2">
                    For Buyers
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Waived buyer's premium</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Advanced purchase tracking</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Early access to exclusive items</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">
                        Priority bidding on popular items
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">Personalized recommendations</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">And more premium features</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-center w-full">
                <DialogClose asChild>
                  <Button className="bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-medium px-6 sm:px-8 py-2 text-sm sm:text-base">
                    Coming Soon
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeContent === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                !isSidebarOpen && "justify-center px-2"
              )}
              onClick={() => {
                handleTabChange(item.id);
                setIsMobileOpen(false);
              }}
            >
              <item.icon className={cn("h-4 w-4", isSidebarOpen && "mr-3")} />
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* <div className="mt-auto p-4 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut className={cn("h-4 w-4", isSidebarOpen && "mr-3")} />
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm"
            >
              Sign out
            </motion.span>
          )}
        </Button>
      </div> */}
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={cn(
          "grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr] p-2 sm:p-8",
          !isSidebarOpen && "lg:grid-cols-[64px_1fr]"
        )}
      >
        {/* Desktop Sidebar */}
        <motion.aside
          className={cn(
            "hidden md:flex flex-col bg-white overflow-hidden rounded-xl",
            isSidebarOpen ? "w-64" : "w-16"
          )}
          initial="open"
          animate={isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
        >
          <div className="flex justify-end p-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 group relative"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200"></div>
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">
                {isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              </span>
            </Button>
          </div>
          <SidebarContent />
        </motion.aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <motion.main
          className="flex-1"
          layout // This will animate the layout changes
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="md:hidden flex items-center p-3 border-b bg-background rounded-xl w-full relative shadow-sm">
            <div className="relative flex items-center">
              {showMobileHint && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded-md py-1.5 px-3 shadow-md whitespace-nowrap z-50 animate-fade-in-out border">
                  Tap to open sidebar
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-t border-l"></div>
                </div>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="mr-3 relative animate-subtle-pulse h-10 w-10 rounded-md border shadow-sm flex items-center justify-center"
                aria-label="Open sidebar menu"
                onClick={() => {
                  setIsMobileOpen(true);
                  setShowMobileHint(false);
                  // Save to localStorage that the user has seen the hint
                  localStorage.setItem("sidebarHintShown", "true");
                }}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <div className="w-full">{renderContent()}</div>
          {/* {renderContent()} */}
        </motion.main>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardClient;
