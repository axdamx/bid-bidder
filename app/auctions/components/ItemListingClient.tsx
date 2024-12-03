"use client";

import { MotionGrid } from "@/app/components/motionGrid";
import CountdownTimer from "@/app/countdown-timer";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, PackageSearch, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ItemsListingClientProps {
  items: any[];
  title: string;
  description: string;
  type: string;
}

export default function ItemsListingClient({
  items,
  title,
  description,
  type,
}: ItemsListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = React.useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  useEffect(() => {
    // Scroll selected tab into view
    const selectedTab = tabsListRef.current?.querySelector(
      '[data-state="active"]'
    );
    if (selectedTab) {
      selectedTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [type]); // Run when tab type changes

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    router.push(`/auctions?type=${value}`);
    // Add a small delay to show the skeleton loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Add this effect to reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    // setIsOpen(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    // setIsOpen(false);
    // Don't navigate if we're already on the target path
    if (path === pathname) {
      return;
    }
    setIsNavigating(true);
    await router.push(path);
  };

  return (
    <MotionGrid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {description}
          </p>
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue={type} onValueChange={handleTabChange}>
          <div className="relative">
            <TabsList
              ref={tabsListRef}
              className="mb-6 md:mb-8 w-full md:w-fit flex md:inline-flex justify-start overflow-x-auto scrollbar-hide"
            >
              <TabsTrigger
                className="flex-1 md:flex-none relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                value="live"
              >
                Live Auctions
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 md:flex-none relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                value="upcoming"
              >
                Upcoming Auctions
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 md:flex-none relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                value="ended"
              >
                Ended Auctions
              </TabsTrigger>
            </TabsList>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <TabsContent value="live">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "live" && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <MotionGrid
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.125 }}
                      >
                        <Link
                          href={`/items/${item.id}`}
                          onClick={(e) =>
                            handleLinkClick(e, `/items/${item.id}`)
                          }
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-0">
                              <div
                                className={`relative aspect-square ${item.backgroundColor}`}
                              >
                                <CldImage
                                  src={item.imageId}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                  width={400}
                                  height={400}
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Current bid: {formatCurrency(item.currentBid)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Starting Price:{" "}
                                  {formatCurrency(item.startingPrice)}
                                </p>
                                <CountdownTimer
                                  endDate={item.endDate}
                                  isOver={item.isBoughtOut}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </MotionGrid>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                          <PackageSearch className="w-12 h-12 text-muted-foreground" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                              No items found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? `No items match your search "${searchTerm}". Try different keywords or browse all items.`
                                : "No live auctions available at the moment. Check back later or try the upcoming auctions."}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "upcoming" && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <MotionGrid
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.125 }}
                      >
                        <Link
                          href={`/items/${item.id}`}
                          onClick={(e) =>
                            handleLinkClick(e, `/items/${item.id}`)
                          }
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-0">
                              <div
                                className={`relative aspect-square ${item.backgroundColor}`}
                              >
                                <CldImage
                                  src={item.imageId}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                  width={400}
                                  height={400}
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Current bid: {formatCurrency(item.currentBid)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Starting Price:{" "}
                                  {formatCurrency(item.startingPrice)}
                                </p>
                                <CountdownTimer
                                  endDate={item.endDate}
                                  isOver={item.isBoughtOut}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </MotionGrid>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                          <PackageSearch className="w-12 h-12 text-muted-foreground" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                              No items found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? `No items match your search "${searchTerm}". Try different keywords or browse all items.`
                                : "No upcoming auctions available at the moment. Check back later or browse live auctions."}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="ended">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "ended" && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <MotionGrid
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.125 }}
                      >
                        <Link
                          href={`/items/${item.id}`}
                          onClick={(e) =>
                            handleLinkClick(e, `/items/${item.id}`)
                          }
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-0">
                              <div
                                className={`relative aspect-square ${item.backgroundColor}`}
                              >
                                <CldImage
                                  src={item.imageId}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                  width={400}
                                  height={400}
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Current bid: {formatCurrency(item.currentBid)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Starting Price:{" "}
                                  {formatCurrency(item.startingPrice)}
                                </p>
                                <CountdownTimer
                                  endDate={item.endDate}
                                  isOver={item.isBoughtOut}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </MotionGrid>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                          <PackageSearch className="w-12 h-12 text-muted-foreground" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                              No items found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? `No items match your search "${searchTerm}". Try different keywords or browse all items.`
                                : "No ended auctions available. Check out our live or upcoming auctions."}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <Dialog open={isNavigating} modal>
        <DialogTitle className="[&>button]:hidden" />
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>
    </MotionGrid>
  );
}
