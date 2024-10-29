import { getEndedAuctions } from "@/app/action";
import ItemCard from "@/app/item-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export async function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center h-[600px] text-white">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold">
          Join Exclusive Auction & Get The Finest
        </h1>
        <div className="mt-4 flex space-x-2">
          <Input
            required
            className="max-w-lg mb-4"
            name="name"
            placeholder="Search"
          />
          <Button>Search</Button>
        </div>
      </div>
    </section>
  );
}
