import { database } from "@/src/db/database";
import ItemCard from "../item-card";
import { eq } from "drizzle-orm";
import { items } from "@/src/db/schema";
import { auth } from "../auth";
import { EmptyState } from "./empty-state";

export default async function MyAuctionPage() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const allItems = await database.query.items.findMany({
    where: eq(items.userId, session.user.id!),
  });

  const hasItems = allItems.length > 0;

  return (
    <main className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">My Current Auctions</h2>
      {hasItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
