"use client";

import * as React from "react";
import {
  Search,
  LayoutGrid,
  LayoutList,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
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
import { CldImage } from "next-cloudinary";
import { formatTimestamp } from "@/app/items/[itemId]/item-page-client";
import Link from "next/link";
import CountdownTimer from "@/app/countdown-timer";
import { formatCurrency } from "@/lib/utils";

// Expanded mock data for the artwork (20 items)
const artworks = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Artwork ${i + 1}`,
  image: `/placeholder.svg?height=400&width=400`,
  backgroundColor: `bg-${["red", "blue", "green", "yellow", "purple"][i % 5]}-${
    [100, 200, 300, 400, 500][i % 5]
  }`,
  startingPrice: Number((Math.random() * 2 + 0.1).toFixed(2)),
  currentBid: Number((Math.random() * 3 + 0.2).toFixed(2)),
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
}));

export default function ProfileTable(ownedItems) {
  const [view, setView] = React.useState("grid");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("low");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  console.log("ownedItems", ownedItems);

  const filteredAndSortedItems = React.useMemo(() => {
    return ownedItems.items
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
  }, [ownedItems, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderContent = () => {
    switch (view) {
      case "list":
        return (
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
                      <CldImage
                        src={item.imageId}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        width={400}
                        height={400}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <Link
                      href={`/items/${item.id}`}
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
        );
      case "grid":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
            {paginatedItems.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="">
                <Card key={item.id} className="overflow-hidden">
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
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Current bid: {formatCurrency(item.currentBid)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Starting Price: {formatCurrency(item.startingPrice)}
                        {/* {formatTimestamp(item.createdAt)} */}
                        {/* {new Date(item.createdAt).toLocaleString()} */}
                      </p>
                      <CountdownTimer endDate={item.endDate} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        );
    }
  };

  // Update the rendering to handle empty states
  if (ownedItems.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
