import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatCurrency, formatTimestamp } from "../utils/formatters";

export function BidHistory({
  bids,
  handleLinkClick,
}: {
  bids: any[];
  handleLinkClick: (e: React.MouseEvent, path: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      {bids.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bidder Name</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.slice(0, 10).map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>
                  <Link
                    href={`/profile/${bid.users.id}`}
                    className="hover:underline cursor-pointer flex items-center gap-1"
                    onClick={(e) =>
                      handleLinkClick(e, `/profile/${bid.users.id}`)
                    }
                  >
                    {bid.users.name}
                    {bids.indexOf(bid) === 0 && (
                      <CrownIcon className="h-5 w-5 text-yellow-400" />
                    )}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(bid.amount)}</TableCell>
                <TableCell>{formatTimestamp(bid.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="p-4">No bids yet.</p>
      )}
    </div>
  );
}
