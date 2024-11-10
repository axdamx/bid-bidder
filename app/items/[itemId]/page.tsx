import { database } from "@/src/db/database";
import { items, bids, users } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import ItemPageClient from "./item-page-client";
import { auth } from "@/app/auth";
import { checkBidAcknowledgmentAction } from "./actions";
import { MotionGrid } from "@/app/components/motionGrid";

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const item = await database.query.items.findFirst({
    where: eq(items.id, parseInt(itemId)),
    with: {
      images: true, // Include the images relation
      // ... other relations ...
    },
  });

  const itemWithUser =
    item &&
    (await database.query.users.findFirst({
      where: eq(users.id, item.userId),
    }));

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

  const itemWithOwner = {
    ...item,
    itemWithUser,
  };

  const hasAcknowledgedBid = await checkBidAcknowledgmentAction(itemId);

  return (
    <MotionGrid
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ItemPageClient
        item={itemWithOwner}
        allBids={allBids}
        userId={userId!}
        hasAcknowledgedBid={hasAcknowledgedBid}
      />
    </MotionGrid>
  );
}
