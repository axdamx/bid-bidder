"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  LayoutGrid,
  LayoutList,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MotionGrid } from "@/app/components/motionGrid";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserItems, updateItemEndDate } from "./actions";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatTimestamp } from "@/app/items/[itemId]/utils/formatters";

export default function ItemsDetails() {
  const [user] = useAtom(userAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  // Define the type for items
  type ItemStatus = "LIVE" | "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED";

  interface Item {
    id: number;
    status: ItemStatus;
    name: string;
    imageId: string;
    startingPrice: number;
    createdAt: string;
    winner?: {
      id: number;
      name: string;
    };
    currentBid: number;
    orderStatus: string;
  }

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const itemsPerPage = 7;
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsUpdateDialogOpen(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) {
      return;
    }
    await router.push(path);
  };

  // Query for fetching items
  const {
    data: itemsData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["userItems", user?.id],
    queryFn: () => fetchUserItems(user?.id || ""),
    enabled: !!user?.id,
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Enable refetch on component mount
    refetchInterval: 30000, // Refresh every 30 seconds
    // staleTime: 10000, // Consider data stale after 10 seconds
  });

  console.log("itemsData", itemsData);

  // Mutation for updating item end date
  const updateEndDateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedItem || !selectedDate) {
        throw new Error("Missing required data");
      }
      const result = await updateItemEndDate(
        selectedItem.id,
        selectedDate.toISOString()
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to update item");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userItems", user?.id] });
      toast.success("Listing reopened successfully!");
      setIsUpdateDialogOpen(false);
      setSelectedDate(undefined);
      setSelectedItem(null);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error updating end date:", error);
      toast.error(error.message || "Failed to reopen listing");
    },
  });

  const handleUpdateEndDate = () => {
    updateEndDateMutation.mutate();
  };

  const items = itemsData?.items || [];

  if (queryError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          Error loading items. Please try again later.
        </p>
      </div>
    );
  }

  const RefreshButton = () => (
    <Button
      onClick={() =>
        queryClient.invalidateQueries({ queryKey: ["userItems", user?.id] })
      }
      variant="outline"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Refreshing...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Items</span>
        </span>
      )}
    </Button>
  );

  const filteredAndSortedItems = items
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

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (item: Item) => {
    if (item.status === "CANCELLED") {
      return <Badge variant="destructive">CANCELLED</Badge>;
    }

    const variants: Record<
      ItemStatus,
      "default" | "destructive" | "outline" | "secondary"
    > = {
      LIVE: "default",
      PENDING: "secondary",
      ACTIVE: "default",
      ENDED: "destructive",
      CANCELLED: "destructive",
    };

    return (
      <Badge variant={variants[item.status] || "default"}>{item.status}</Badge>
    );
  };

  const canReopen = (item: Item) => {
    return (
      (item.status === "ENDED" || item.status === "CANCELLED") &&
      item.orderStatus !== "delivered" &&
      item.orderStatus !== "paid"
    );
  };

  const StatusInfoCard = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6 p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="default">LIVE</Badge>
                <span className="text-sm font-medium">Active Auction</span>
              </div>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The item's auction is ongoing and accepting bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">PENDING</Badge>
                <span className="text-sm font-medium">Payment Process</span>
              </div>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Item can no longer be bid on, awaiting payment completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">ENDED</Badge>
                <span className="text-sm font-medium">Completed</span>
              </div>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Item sold and payment process completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">CANCELLED</Badge>
                <span className="text-sm font-medium">Missed Checkout</span>
              </div>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Buyer missed checkout window. Item can be relisted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen Listing</DialogTitle>
            <DialogDescription>
              Select a new end date for your listing
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              id="endDate"
              type="datetime-local"
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                // Create a proper Date object from the input value
                const date = new Date(value);
                setSelectedDate(date);
              }}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEndDate}
              disabled={!selectedDate || updateEndDateMutation.isPending}
            >
              {updateEndDateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop view */}
      <div className="hidden md:block space-y-4 p-4">
        {StatusInfoCard()}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
                <SelectItem value="createdAt">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            <RefreshButton />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Starting Price</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <CldImage
                          src={item.imageId}
                          alt={item.name}
                          className="object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/items/${item.id}`}
                        onClick={(e) => handleLinkClick(e, `/items/${item.id}`)}
                        className="hover:underline text-primary underline"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>RM {item.startingPrice.toFixed(2)}</TableCell>
                    <TableCell>{formatTimestamp(item.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell>
                      {item.winner ? (
                        <Link
                          href={`/profile/${item.winner.id}`}
                          onClick={(e) =>
                            handleLinkClick(e, `/profile/${item.winner.id}`)
                          }
                          className="hover:underline text-primary underline"
                        >
                          {item.winner.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {canReopen(item) && (
                        <Button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsUpdateDialogOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Reopen
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Mobile view */}
      <div className="md:hidden p-4">
        {StatusInfoCard()}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <RefreshButton />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
                <SelectItem value="createdAt">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No Items Found</p>
            </div>
          ) : (
            paginatedItems.map((item) => (
              <div key={item.id} className="p-4 border-b">
                <div className="flex gap-4">
                  {/* Left side - Image */}
                  <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
                    <CldImage
                      src={item.imageId}
                      alt={item.name}
                      className="object-cover"
                      width={80}
                      height={80}
                    />
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Top row - Name and Status */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-small">
                        <Link
                          href={`/items/${item.id}`}
                          onClick={(e) =>
                            handleLinkClick(e, `/items/${item.id}`)
                          }
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      {getStatusBadge(item)}
                    </div>

                    {/* Price and Created At */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        RM {item.startingPrice.toFixed(2)}
                      </span>
                      {/* <span className="text-muted-foreground">
                        {formatTimestamp(item.createdAt)}
                      </span> */}
                    </div>

                    {/* Winner and Action Button */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        {item.winner ? (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              Winner:
                            </span>
                            <Link
                              href={`/profile/${item.winner.id}`}
                              onClick={(e) =>
                                handleLinkClick(e, `/profile/${item.winner.id}`)
                              }
                              className="text-primary hover:underline"
                            >
                              {item.winner.name}
                            </Link>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No winner yet
                          </span>
                        )}
                      </div>
                      {canReopen(item) && (
                        <Button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsUpdateDialogOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
