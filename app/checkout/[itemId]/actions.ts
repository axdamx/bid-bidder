import { supabase } from "@/lib/utils";
import { database } from "@/src/db/database";
import { items } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

// Function to get items for checkout
export async function getCheckoutItems(userId: string) {
  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('winnerId', userId)
    .eq('status', 'CHECKOUT')
    .single();

  return item;
}
