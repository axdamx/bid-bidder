import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BidDisclaimerModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function BidDisclaimerModal({
  isOpen,
  onConfirm,
  onClose,
}: BidDisclaimerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Important Notice About Bidding</DialogTitle>
          <DialogDescription className="pt-4">
            By placing a bid, you are entering into a binding commitment to
            purchase the item if you win. Your bid represents a legal obligation
            to buy the item at the bid price if you are the winning bidder.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
