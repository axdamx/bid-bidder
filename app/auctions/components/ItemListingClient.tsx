"use client";

import ProfileTable from "@/app/profile/[userId]/components/profileTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface ItemsListingClientProps {
  items: any[];
  title: string;
  description: string;
  type: string;
}

export default function ItemsListingClient({
  items,
  title,
  description,
  type,
}: ItemsListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log("items", items);
  console.log("type", type);
  console.log("title", title);

  const handleTabChange = (value: string) => {
    router.push(`/auctions?type=${value}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue={type} onValueChange={handleTabChange}>
        <TabsList className="mb-8">
          <TabsTrigger value="live">Live Auctions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Auctions</TabsTrigger>
          <TabsTrigger value="ended">Ended Auctions</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <ProfileTable items={type === "live" ? items : []} />
        </TabsContent>
        <TabsContent value="upcoming">
          <ProfileTable items={type === "upcoming" ? items : []} />
        </TabsContent>
        <TabsContent value="ended">
          <ProfileTable items={type === "ended" ? items : []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
