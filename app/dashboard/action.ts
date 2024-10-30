// app/actions/user.ts
"use server";

import { auth } from "../auth";

export async function getUserData() {
  try {
    const session = await auth();
    return { user: session?.user, error: null };
  } catch (error) {
    return { user: null, error: "Failed to fetch user data" };
  }
}
