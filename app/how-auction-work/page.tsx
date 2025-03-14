import { Metadata } from "next";
import { AuctionWorkClient } from "./components/AuctionWorkClient";

export const metadata: Metadata = {
  title: "How Auctions Work | Renown",
  description: "Learn about our auction process, buyer and seller guides, and post-auction procedures",
};

export default function HowAuctionWorkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AuctionWorkClient />
    </div>
  );
}
