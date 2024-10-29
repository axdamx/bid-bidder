import { getUpcomingAuctions } from "@/app/action";
import ItemCard from "@/app/item-card";

export async function UpcomingAuctions() {
  const items = await getUpcomingAuctions();

  return (
    <section className="py-10">
      <h2 className="text-center text-3xl font-bold mb-6">Upcoming Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
