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
import { Package } from "lucide-react";

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
                  href="/items/create"
                  className="hover:underline whitespace-nowrap"
                >
                  <Button>Create Auction</Button>
                </Link>
              </CardContent>
            </Card>
          </MotionGrid>
        )}
      </div>
      {items.length > 0 && (
        <Pagination className="justify-center p-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(page - 1, 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setPage(pageNumber)}
                    isActive={pageNumber === page}
                    className="cursor-pointer opacity-100"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
