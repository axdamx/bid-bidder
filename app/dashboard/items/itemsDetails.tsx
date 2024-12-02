"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { formatTimestamp } from "@/app/items/[itemId]/item-page-client";
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
import { Search, LayoutGrid, LayoutList, Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MotionGrid } from "@/app/components/motionGrid";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { toast } from "sonner";
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

export default function ItemsDetails() {
  const [user] = useAtom(userAtom);
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 9;
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) {
      return;
    }
    setIsNavigating(true);
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
    retry: 1,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

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

  const getStatusBadge = (item) => {
    if (item.status === "CANCELLED") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }

    const variants = {
      LIVE: "default",
      PENDING: "secondary",
      ACTIVE: "default",
      ENDED: "destructive",
    };
    return (
      <Badge variant={variants[item.status] || "default"}>{item.status}</Badge>
    );
  };

  const canReopen = (item) => {
    return item.status === "CANCELLED" || item.status === "ENDED";
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
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              initialFocus
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
                <SelectItem value="createdAt">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup type="single" value={view} onValueChange={setView}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {view === "list" ? (
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
                {paginatedItems.map((item) => (
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
                        className="hover:underline text-primary"
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
                          onClick={(e) => handleLinkClick(e, `/profile/${item.winner.id}`)}
                          className="hover:underline text-primary"
                        >
                          {item.winner.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <Button variant="link" asChild className="p-0">
                          <Link
                            href={`/items/${item.id}`}
                            onClick={(e) =>
                              handleLinkClick(e, `/items/${item.id}`)
                            }
                          >
                            View
                          </Link>
                        </Button> */}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {paginatedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Link
                  href={`/items/${item.id}`}
                  onClick={(e) => handleLinkClick(e, `/items/${item.id}`)}
                  className="block"
                >
                  <div className="relative aspect-square">
                    <CldImage
                      src={item.imageId}
                      alt={item.name}
                      className="object-cover"
                      fill
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(item)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Starting Price: RM {item.startingPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current Bid: RM {item.currentBid.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {formatTimestamp(item.createdAt)}
                      </p>
                      {canReopen(item) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedItem(item);
                            setIsUpdateDialogOpen(true);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}