import { database } from "@/src/db/database";
import { items, bids } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import ItemPageClient from "./item-page-client";

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, parseInt(itemId)),
  });

  if (!item) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> Item Not Found! </h1>
      </div>
    );
  }

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

  return <ItemPageClient item={item} allBids={allBids} />;
}
