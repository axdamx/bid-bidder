import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ShippingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { courier: string; trackingNumber: string }) => void;
}

const courierServices = [
  "J&T Express",
  "Pos Laju",
  "DHL",
  "FedEx",
  "City-Link Express",
  "GDex",
  "Other"
];

export function ShippingDetailsModal({
  isOpen,
  onClose,
  onSubmit,
}: ShippingDetailsModalProps) {
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = () => {
    if (!courier || !trackingNumber) return;
    onSubmit({ courier, trackingNumber });
    setCourier("");
    setTrackingNumber("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Shipping Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courier">Courier Service</Label>
            <Select value={courier} onValueChange={setCourier}>
              <SelectTrigger>
                <SelectValue placeholder="Select courier service" />
              </SelectTrigger>
              <SelectContent>
                {courierServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!courier || !trackingNumber}>
            Update Shipping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
