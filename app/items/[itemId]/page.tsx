import { database } from "@/src/db/database";
import { items, bids, users } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import ItemPageClient from "./item-page-client";
import { auth } from "@/app/auth";
import { checkBidAcknowledgmentAction, getLatestBidWithUser } from "./actions";
import { MotionGrid } from "@/app/components/motionGrid";
import { supabase } from "@/lib/utils";
import { get } from "http";

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const { data: item } = await supabase
    .from("items")
    .select(
      `
      *,
      images (*)
    `
    )
    .eq("id", parseInt(itemId))
    .single();

  const { data: itemUser } =
    item &&
    (await supabase.from("users").select("*").eq("id", item.userId).single());

  if (!item) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> Item Not Found! </h1>
      </div>
    );
  }

  console.log("item baemon", item);
  console.log("itemWituUser baemon", itemUser);

  const { data: bids = [] } = await supabase
    // .from("bids")
    // .select("*, users (*)")
    // .eq("itemId", parseInt(itemId))
    // .order("id", { ascending: false });

    .from("bids")
    .select("*, users (*)")
    .eq("itemId", itemId)
    .order("id", { ascending: false });

  // TODO fix the delay on bidding
  // 1. Open 2 accounts that is bidding on the same item
  // 2. User A bid on the item
  // 3. User B bid on the item
  // 4. User A go back to home page
  // 5. User A go back to the same item page
  // 6. User A still seeing the old price, only hard refresh will fix this
  const bestBid = await getLatestBidWithUser(itemId);
  console.log("best bid", bestBid);

  const allBids = bids || [];

  const itemWithOwner = {
    ...item,
    itemUser,
  };

  const hasAcknowledgedBid = await checkBidAcknowledgmentAction(itemId);

  console.log("allbids yo heay", allBids);
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
