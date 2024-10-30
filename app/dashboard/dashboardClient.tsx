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

type User = {
  name?: string;
  email?: string;
  image?: string;
} | null;

interface DashboardClientProps {
  initialUser?: User;
}

const DashboardClient = ({ initialUser }: DashboardClientProps) => {
  console.log("🚀 ~ DashboardClient ~ initialUser:", initialUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("userDetails");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!initialUser) {
    return null;
  }

  const initials = initialUser?.name
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
    switch (activeContent) {
      case "userDetails":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        );
      case "address":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Address</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Shipping Addresses</h3>
                <p className="text-gray-600">Manage your shipping addresses</p>
              </div>
            </div>
          </div>
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
      <div className="p-1 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={initialUser.image} alt="User" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isSidebarOpen && (
            <div>
              <p className="font-medium">{initialUser?.name}</p>
              <p className="text-sm text-gray-500">{initialUser?.email}</p>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeContent === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                !isSidebarOpen && "justify-center"
              )}
              onClick={() => setActiveContent(item.id)}
            >
              <item.icon className={cn("h-4 w-4", isSidebarOpen && "mr-2")} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut className={cn("h-4 w-4", isSidebarOpen && "mr-2")} />
          {isSidebarOpen && <span>Sign out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col border-r bg-white",
          isSidebarOpen ? "w-80" : "w-20"
        )}
      >
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
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
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute top-4 left-4"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
};

export default DashboardClient;
