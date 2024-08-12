import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { database } from "@/src/db/database";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(database),
  providers: [Google],
});
