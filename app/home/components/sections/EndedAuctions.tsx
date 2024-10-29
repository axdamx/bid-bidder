import { getEndedAuctions } from "@/app/action";
import ItemCard from "@/app/item-card";

export async function EndedAuctions({ limit = 3 }: { limit?: number }) {
  const items = (await getEndedAuctions()).slice(0, limit);

  return (
    <section className="bg-gray-100 py-10">
      <h2 className="text-center text-3xl font-bold mb-6">Recent Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
