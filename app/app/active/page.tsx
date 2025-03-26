import { Metadata } from "next";
import { ActiveBidsClient } from "./components/ActiveBidsClient";

export const metadata: Metadata = {
  title: "Active Bids | Renown",
  description: "View and manage your active bids and auctions",
};

export default function ActiveBidsPage() {
  return (
    <div className="container mx-auto py-8">
      <ActiveBidsClient />
    </div>
  );
}
