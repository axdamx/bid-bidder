"use client";

import { MotionGrid } from "@/app/components/motionGrid";
import CountdownTimer from "@/app/countdown-timer";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  PackageSearch,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Shirt,
  Home,
  Trophy,
  Album,
  BookOpen,
  Palette,
  Car,
  MoreHorizontal,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/app/components/headerSearch";

interface ItemsListingClientProps {
  items: any[];
  title: string;
  description: string;
  type: string;
}

const categories = [
  { value: "all", label: "All Items", icon: LayoutGrid },
  { value: "electronics", label: "Electronics", icon: Laptop },
  { value: "fashion", label: "Fashion", icon: Shirt },
  { value: "home", label: "Home & Living", icon: Home },
  { value: "sports", label: "Sports & Outdoors", icon: Trophy },
  { value: "collectibles", label: "Collectibles", icon: Album },
  { value: "books", label: "Books & Media", icon: BookOpen },
  { value: "art", label: "Art & Crafts", icon: Palette },
  { value: "automotive", label: "Automotive", icon: Car },
  { value: "others", label: "Others", icon: MoreHorizontal },
];

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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Reset page when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Memoized filter function
  const filterItem = useCallback(
    (item: any) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    },
    [debouncedSearchTerm, selectedCategory]
  );

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(filterItem);
  }, [items, filterItem]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  useEffect(() => {
    setIsNavigating(false);
    // setIsOpen(false);
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    router.push(`/auctions?type=${value}`);
    // Add a small delay to show the skeleton loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

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

  console.log("paginatedItems", paginatedItems);

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
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Tabs
          defaultValue={type}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="relative">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto">
              <div className="flex min-w-full px-4">
                <TabsTrigger
                  value="live"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Live Auctions
                </TabsTrigger>
                {/* <TabsTrigger
                  value="upcoming"
                  disabled
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Upcoming Auctions
                </TabsTrigger> */}
                <TabsTrigger
                  value="ended"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Ended Auctions
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="live" className="border-none p-0 outline-none">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border my-4">
              <div className="flex w-max space-x-4 p-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      className="flex-shrink-0 gap-2"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "live" && filteredItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
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
                                <OptimizedImage
                                  width={400}
                                  height={300}
                                  src={item.imageId}
                                  alt={item.name}
                                  className="object-cover w-full h-full rounded-t-lg"
                                  quality="eco"
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
                {filteredItems.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px]">
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent
            value="upcoming"
            className="border-none p-0 outline-none"
          >
            <ScrollArea className="w-full whitespace-nowrap rounded-md border my-4">
              <div className="flex w-max space-x-4 p-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      className="flex-shrink-0 gap-2"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "upcoming" && filteredItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
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
                                <OptimizedImage
                                  width={400}
                                  height={300}
                                  src={item.imageId}
                                  alt={item.name}
                                  className="object-cover w-full h-full rounded-t-lg"
                                  quality="eco"
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
                {filteredItems.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px]">
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="ended" className="border-none p-0 outline-none">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border my-4">
              <div className="flex w-max space-x-4 p-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      className="flex-shrink-0 gap-2"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                  {type === "ended" && filteredItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
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
                                <OptimizedImage
                                  width={400}
                                  height={300}
                                  src={item.imageId}
                                  alt={item.name}
                                  className="object-cover w-full h-full rounded-t-lg"
                                  quality="eco"
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
                {filteredItems.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px]">
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
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
