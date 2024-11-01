"use server";

import { items } from "@/src/db/schema";
import { revalidatePath } from "next/cache";
import { database } from "@/src/db/database";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function createItemAction(formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  // insert into database
  await database.insert(items).values({
    name: formData.get("name") as string,
    startingPrice: parseFloat(formData.get("startingPrice") as string),
    userId: user.id!,
    imageId: formData.get("imageId") as string, // Add the imageId from the form data
    bidInterval: parseFloat(formData.get("bidInterval") as string),
    endDate: new Date(formData.get("endDate") as string),
    description: formData.get("description") as string,
  });
  // action after user clicked the button
  redirect("/");
}
