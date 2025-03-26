import { Card, CardContent } from "@/components/ui/card";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingsTabProps {
  items: any[]; // Replace 'any' with a proper item type
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
}

export const ListingsTab = ({
  items,
  page,
  setPage,
  totalPages,
  isLoading,
}: ListingsTabProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 mb-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading items...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card key={item.id} className="overflow-hidden h-fit">
              <CardContent className="p-0">
                <MotionGrid
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.125 }}
                >
                  <ItemCard key={item.id} item={item} />
                </MotionGrid>
              </CardContent>
            </Card>
          ))
        ) : (
          <MotionGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.125 }}
          >
            <Card className="col-span-full p-6">
              <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h3 className="font-semibold text-lg">No Listings Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first auction listing
                </p>
                <Link
                  href="/app/items/create"
                  className="hover:underline whitespace-nowrap"
                >
                  <Button>Create Auction</Button>
                </Link>
              </CardContent>
            </Card>
          </MotionGrid>
        )}
      </div>
      {items.length > 0 && totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
