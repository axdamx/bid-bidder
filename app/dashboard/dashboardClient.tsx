"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import UserDetailsPage from "./userdetails/userDetails";
import Addresses from "./address/addressDetails";
import PaymentsAndPayouts from "./payment/paymentDetails";
import OrderDetails from "./orders/ordersDetails";
import HelpDetails from "./help/helpDetails";
// import ItemsDetails from "./items/itemsDetails";
import { MotionGrid } from "../components/motionGrid";
import { userAtom } from "../atom/userAtom";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ItemsDetails from "./items/itemsDetails";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(
    searchParams.get("tab") || "userDetails"
  );

  if (!initialUser) {
    return null;
  }

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveContent(tabId);
    router.push(`/dashboard?tab=${tabId}`);
  };

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
      name: "Payment Method",
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
      name: "Help",
      icon: HelpCircle,
      id: "help",
      description: "Get support and find answers to common questions",
    },
    {
      name: "Items",
      icon: Package,
      id: "items",
      description: "Manage your items",
    },
  ];

  const renderContent = () => {
    // TODO: fix or enhance this button on all the content
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
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your payment methods
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
      case "help":
        return (
          <MotionGrid>
            <div className="p-2 sm:p-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Help</CardTitle>
                  <CardDescription className="text-sm">
                    Get support and find answers to common questions
                  </CardDescription>
                </CardHeader>
                <HelpDetails />
              </Card>
            </div>
          </MotionGrid>
        );
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
      // Similar content sections for other navigation items
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
        <div className="flex items-center gap-4 mb-2">
          {/* <Avatar className="h-10 w-10">
            <AvatarImage src={initialUser?.image} alt="User" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar> */}
          <Avatar className="w-10 h-10">
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
            >
              <div>
                <p className="font-semibold text-sm">{initialUser?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {initialUser?.email}
                </p>
              </div>
            </motion.div>
          )}
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

      <div className="mt-auto p-4 border-t">
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
      </div>
    </div>
  );

  return (
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
            className="h-6 w-6"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </motion.div>
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
        <div className="md:hidden flex items-center p-2 border-b bg-background rounded-xl w-full">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setIsMobileOpen(true)}
          >
            <List className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div className="w-full">{renderContent()}</div>
        {/* {renderContent()} */}
      </motion.main>
    </div>
  );
};

export default DashboardClient;
