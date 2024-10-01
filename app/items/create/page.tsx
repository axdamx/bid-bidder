import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItemAction } from "./actions";

export default async function CreatePage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-4">Post an Item</h1>
      <form
        className="border p-8 rounded-xl mb-4 max-w-lg"
        action={createItemAction}
      >
        <Input
          required
          className="max-w-lg mb-4"
          name="name"
          placeholder="Name your Item"
        />
        <Input
          required
          className="max-w-lg mb-4"
          name="startingPrice"
          type="number"
          placeholder="Start Price"
        />
        <Button type="submit">Place Bid</Button>
      </form>
    </main>
  );
}
