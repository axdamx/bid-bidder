// disabled typescript for this file
"use client";

import { EmptyState } from "@/app/auctions/empty-state";
import MainItemCard from "@/app/components/MainItemCard";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function PostFeed({ ownedItems }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const hasItems = ownedItems.length > 0;

  const totalPages = Math.ceil(ownedItems.length / itemsPerPage);
  const paginatedItems = ownedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <div className="space-y-4">
      {hasItems ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((item, index) => (
              <MotionGrid
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.125 }}
              >
                <ItemCard key={item.id} item={item} />
                {/* <MainItemCard /> */}
              </MotionGrid>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <span className="flex items-center">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
