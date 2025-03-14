import { Metadata } from "next";
import { CreateItemClient } from "./components/CreateItemClient";

export const metadata: Metadata = {
  title: "Create Listing | Renown",
  description: "Create a new listing for your item",
};

export default function CreatePage() {
  return (
    <div className="container mx-auto py-8">
      <CreateItemClient />
    </div>
  );
}
