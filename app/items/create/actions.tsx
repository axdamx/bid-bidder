"use server";

import { images, items } from "@/src/db/schema";
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
  // await database.insert(items).values({
  //   name: formData.get("name") as string,
  //   startingPrice: parseFloat(formData.get("startingPrice") as string),
  //   userId: user.id!,
  //   imageId: formData.get("imageId") as string, // Add the imageId from the form data
  //   bidInterval: parseFloat(formData.get("bidInterval") as string),
  //   endDate: new Date(formData.get("endDate") as string),
  //   description: formData.get("description") as string,
  // });
  // insert item into database
  // insert item into database with first image as imageId
  const [newItem] = await database
    .insert(items)
    .values({
      name: formData.get("name") as string,
      startingPrice: parseFloat(formData.get("startingPrice") as string),
      userId: user.id!,
      bidInterval: parseFloat(formData.get("bidInterval") as string),
      endDate: new Date(formData.get("endDate") as string),
      description: formData.get("description") as string,
      imageId: (formData.getAll("images[]") as string[])[0], // Set first image as imageId
    })
    .returning();

  // get image IDs and insert into images table (all images including the first one)
  const imageIds = formData.getAll("images[]") as string[];
  await database.insert(images).values(
    imageIds.map((publicId) => ({
      itemId: newItem.id,
      publicId,
    }))
  );
  // Revalidate the home page
  revalidatePath("/");
  // action after user clicked the button
  redirect("/");
}
