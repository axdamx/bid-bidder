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
import { MotionGrid } from "../components/motionGrid";
import { userAtom } from "../atom/userAtom";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
  name?: string;
  email?: string;
  image?: string;
} | null;

interface DashboardClientProps {
  initialUser?: User;
}

const DashboardClient = ({ initialUser }: DashboardClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [activeContent, setActiveContent] = useState("userDetails");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user] = useAtom(userAtom);

  // console.log("initialUser", initialUser);

  if (!initialUser) {
    return null;
  }

  // Get the tab from URL params or default to "userDetails"
  const [activeContent, setActiveContent] = useState(
    searchParams.get("tab") || "userDetails"
  );

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveContent(tabId);
    router.push(`/dashboard?tab=${tabId}`);
  };

  const initials = user?.name
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
  ];

  const renderContent = () => {
    // TODO: fix or enhance this button on all the content
    switch (activeContent) {
      case "userDetails":
        return (
          <MotionGrid>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <UserDetailsPage initialUser={user} />
              </Card>
            </div>
          </MotionGrid>
        );
      case "address":
        return (
          <MotionGrid>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address</CardTitle>
                  <CardDescription>
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
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <PaymentsAndPayouts />
              </Card>
            </div>
          </MotionGrid>
        );
      case "orders":
        return (
          <MotionGrid>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <OrderDetails />
              </Card>
            </div>
          </MotionGrid>
        );
      case "help":
        return (
          <MotionGrid>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <HelpDetails />
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image} alt="User" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isSidebarOpen && (
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
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
                setIsMobileOpen(false); // Close mobile sidebar when clicking item
              }}
            >
              <item.icon className={cn("h-4 w-4", isSidebarOpen && "mr-3")} />
              {isSidebarOpen && <span className="text-sm">{item.name}</span>}
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
          {isSidebarOpen && <span className="text-sm">Sign out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex max-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-white overflow-hidden", // Added overflow-hidden
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
        {" "}
        {/* Removed overflow-auto */}
        <div className="md:hidden flex items-center p-4 border-b bg-background">
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
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardClient;
