import { Button } from "@/components/ui/button";
import { database } from "@/src/db/database";
import { bids, items } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import ItemImage from "./image-component";
import { formatDistance, subDays } from "date-fns";
import { createBidAction } from "./actions";

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), {
    addSuffix: true,
  });
}

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, parseInt(itemId)),
  });

  const allBids = await database.query.bids.findMany({
    where: eq(bids.itemId, parseInt(itemId)),
    orderBy: desc(bids.id),
    with: {
      user: {
        columns: {
          image: true,
          name: true,
        },
      },
    },
  });

  const hasBids = allBids.length > 0;

  if (!item) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <Image src="/empty.svg" width={200} height={200} alt="empty" />
        <h1 className="text-2xl font-bold"> Item Not Found! </h1>
        <p> The item you find is invalid </p>
        <Button asChild>
          <Link href="/auctions">View Auction</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-12">
      <div className="flex gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Auction for: {item.name}</h1>
          <ItemImage item={item} />
          <div className="text-xl mt-8 space-y-4">
            <h1 className="text-2xl font-bold">
              Current Bid: ${item.currentBid}
            </h1>
            <h1 className="text-2xl font-bold">
              Starting Price of ${item.startingPrice}
            </h1>
            <h1 className="text-2xl font-bold">
              Bid Interval of ${item.bidInterval}
            </h1>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Current Bids</h2>
            {hasBids && (
              <form action={createBidAction.bind(null, item.id)}>
                <Button> Place A Bid </Button>
              </form>
            )}
          </div>

          {hasBids ? (
            <ul className="space-y-4">
              {allBids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div>
                    <span className="font-bold">${bid.amount}</span> by{" "}
                    <span className="font-bold">{bid.user.name}</span>{" "}
                    <span className="">{formatTimestamp(bid.timestamp)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-xl p-12">
              <Image src="/empty.svg" width={200} height={200} alt="empty" />
              <h2 className="text-2xl font-bold"> No Bids Yet! </h2>
              <form action={createBidAction.bind(null, item.id)}>
                <Button> Place A Bid </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
