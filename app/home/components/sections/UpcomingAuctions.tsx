import { getUpcomingAuctions } from "@/app/action";
import ItemCard from "@/app/item-card";

export async function UpcomingAuctions() {
  const items = await getUpcomingAuctions();

  return (
    <section className="w-full">
      {/* <h2 className="text-center text-3xl font-bold mb-6">Upcoming Auctions</h2> */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Upcoming Auctions
            </h2>
            <p className="text-muted-foreground mt-1">
              Don't miss these upcoming drops
            </p>
          </div>
          <a href="/upcoming" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
