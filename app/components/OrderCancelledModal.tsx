"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderCancelledModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
  itemName: string | null;
}

export function OrderCancelledModal({
  isOpen,
  onClose,
  orderId,
  itemName,
}: OrderCancelledModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <XCircle className="h-12 w-12 text-red-500 mb-2" />
          <DialogTitle className="text-center">Order Cancelled</DialogTitle>
          <DialogDescription className="text-center">
            The checkout window for order #{orderId} ({itemName}) has expired. 
            According to our policy, orders must be completed within 30 minutes.
            This order has been automatically cancelled.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center mt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
