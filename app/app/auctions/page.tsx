import {
  getLiveAuctions,
  getUpcomingAuctions,
  getEndedAuctions,
} from "@/app/action";
import ItemsListingClient from "./components/ItemListingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auctions | Renown",
  description: "Browse all available auctions and place your bids",
};

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  // Get the auction type from URL params, default to "live"
  const type = searchParams.type || "live";

  // Fetch data based on type
  let items = [];
  let title = "";
  let description = "";

  switch (type) {
    case "live":
      items = await getLiveAuctions();
      title = "Live Auctions";
      description = "Currently active auctions";
      break;
    // case "upcoming":
    //   items = await getUpcomingAuctions();
    //   title = "Upcoming Auctions";
    //   description = "Auctions starting soon";
    //   break;
    case "ended":
      items = await getEndedAuctions();
      title = "Ended Auctions";
      description = "Past auction results";
      break;
  }

  return (
    <ItemsListingClient
      items={items}
      title={title}
      description={description}
      type={type}
    />
  );
}
