import Image from "next/image";
import { database } from "@/src/db/database";
import { bids as bidsSchema } from "@/src/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

export default async function HomePage() {
  const bids = await database.query.bids.findMany();
  return (
    <main className="container mx-auto py-12">
      <form
        action={async (formData: FormData) => {
          "use server";
          await database.insert(bidsSchema).values({});
          revalidatePath("/");
        }}
      >
        <Input name="bid" placeholder="Bid" />
        <Button type="submit">Place Bid</Button>
      </form>

      {bids.map((bid) => (
        <div key={bid.id}>{bid.id}</div>
      ))}
    </main>
  );
}
