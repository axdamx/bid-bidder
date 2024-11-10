// import { getEndedAuctions } from "@/app/action";
// import ItemCard from "@/app/item-card";

import { getEndedAuctions } from "@/app/action";
import { MotionGrid } from "@/app/components/motionGrid";
import ItemCard from "@/app/item-card";

// export async function EndedAuctions({ limit = 3 }: { limit?: number }) {
//   const items = (await getEndedAuctions()).slice(0, limit);

//   return (
//     <section className="bg-gray-100 py-10">
//       {/* <h2 className="text-center text-3xl font-bold mb-6">Recent Auctions</h2> */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
//         {items.map((item) => (
//           <ItemCard key={item.id} item={item} />
//         ))}
//       </div>
//     </section>
//   );
// }
export async function EndedAuctions({ limit = 3 }: { limit?: number }) {
  const items = (await getEndedAuctions()).slice(0, limit);

  return (
    <section className="w-full">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Past Auctions</h2>
            <p className="text-muted-foreground mt-1">Recently sold items</p>
          </div>
          <a href="/ended" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <MotionGrid
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <ItemCard key={item.id} item={item} />
            </MotionGrid>
          ))}
        </div>
      </div>
    </section>
  );
}
