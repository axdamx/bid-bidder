"use client";

import * as React from "react";
import {
  Search,
  LayoutGrid,
  LayoutList,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import Link from "next/link";
import CountdownTimer from "@/app/countdown-timer";
import { formatCurrency } from "@/lib/utils";
import { MotionGrid } from "@/app/components/motionGrid";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatTimestamp } from "@/app/app/items/[itemId]/utils/formatters";

interface Item {
  id: string;
  name: string;
  startingPrice: number;
  currentBid: number;
  createdAt: string;
  endDate: string;
  isBoughtOut: boolean;
  images: string[];
  backgroundColor: string;
}

interface OwnedItemsProps {
  items: Item[];
}

export default function ProfileTable({ items }: OwnedItemsProps) {
  const [view, setView] = React.useState("grid");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("low");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;
  const maxVisiblePages = 4;

  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const filteredAndSortedItems = React.useMemo(() => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case "low":
            return a.startingPrice - b.startingPrice;
          case "high":
            return b.startingPrice - a.startingPrice;
          case "createdAt":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
  }, [items, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const renderContent = () => {
    switch (view) {
      case "list":
        return (
          <MotionGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-center">Image</TableHead>
                  <TableHead className="text-center">Item Name</TableHead>
                  <TableHead className="text-center">Starting Price</TableHead>
                  <TableHead className="text-center">Current Bid</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <div
                        className={`relative h-24 w-24 ${item.backgroundColor} rounded-xl overflow-hidden`}
                      >
                        <OptimizedImage
                          width={100}
                          height={100}
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          quality="eco"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <Link
                        href={`/app/items/${item.id}`}
                        className="text-blue-600 underline transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      RM {item.startingPrice.toFixed(2)}{" "}
                    </TableCell>
                    <TableCell className="text-center">
                      RM {item.currentBid.toFixed(2)}{" "}
                    </TableCell>
                    <TableCell className="text-center flex-row">
                      {new Date(item.createdAt).toLocaleDateString()}
                      <br />
                      {formatTimestamp(item.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MotionGrid>
        );
      case "grid":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
            {paginatedItems.map((item, index) => (
              <MotionGrid
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.125 }}
              >
                <Link
                  key={item.id}
                  href={`/app/items/${item.id}`}
                  className=""
                  onClick={(e) => handleLinkClick(e, `/app/items/${item.id}`)}
                >
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div
                        className={`relative aspect-square ${item.backgroundColor}`}
                      >
                        <OptimizedImage
                          width={100}
                          height={100}
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          quality="eco"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Current bid: {formatCurrency(item.currentBid)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Starting Price: {formatCurrency(item.startingPrice)}
                          {/* {formatTimestamp(item.createdAt)} */}
                          {/* {new Date(item.createdAt).toLocaleString()} */}
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
            ))}
          </div>
        );
    }
  };

  // Update the rendering to handle empty states
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:mt-6 md:mt-0">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Price low to high</SelectItem>
              <SelectItem value="high">Price high to low</SelectItem>
              <SelectItem value="createdAt">Newest First</SelectItem>
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
            className="justify-start sm:justify-center"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {renderContent()}

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent className="flex-wrap justify-center gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {getVisiblePages().map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageNum)}
                  isActive={currentPage === pageNum}
                  className="min-w-[40px] h-[40px] flex items-center justify-center"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
