import { database } from "@/src/db/database";

export default async function HomePage() {
  const allItems = await database.query.items.findMany();

  return (
    <main className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Items For Sale</h2>
      <div className="grid grid-cols-4 gap-8">
        {allItems.map((item) => (
          <div className="border p-8 rounded-xl" key={item.id}>
            {item.name}
            starting price : ${item.startingPrice}
          </div>
        ))}
      </div>
    </main>
  );
}
