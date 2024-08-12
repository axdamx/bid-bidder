import Image from "next/image";
import { database } from "@/src/db/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import { auth } from "./auth";
import { items } from "@/src/db/schema";

export default async function HomePage() {
  const session = await auth();

  console.log(database);
  console.log(database.query);
  const allItems = await database.query.items.findMany();

  if (!session) return null;

  const user = session.user;

  if (!user) return null;

  const renderButtons = () => (session ? <SignOut /> : <SignIn />);
  const renderName = () => user.name;

  return (
    <main className="container mx-auto py-12">
      {renderButtons()}
      {renderName()}
      <form
        action={async (formData: FormData) => {
          "use server";
          await database.insert(items).values({
            name: formData.get("name") as string,
            userId: user.id!,
          });
          revalidatePath("/");
        }}
      >
        <Input name="name" placeholder="Name your Item" />
        <Button type="submit">Place Bid</Button>
      </form>

      {allItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </main>
  );
}
