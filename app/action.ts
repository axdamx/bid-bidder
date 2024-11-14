"use server";

import { supabase } from "@/lib/utils";
import { database } from "@/src/db/database";
import { items, users } from "@/src/db/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, ilike } from "drizzle-orm";

// export async function getUserById(userId: string) {
//   if (!userId) return null;

//   return await database.query.users.findFirst({
//     where: eq(users.id, userId),
//   });
// }

// import { database } from "@/src/db/database";
import { cache } from "react";
import { signIn, signOut } from "./auth";
export async function getUserById(userId: string) {
  if (!userId) return null;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
    return null;
  }
}

// export const getItemsWithUsers = cache(async () => {
//   try {
//     const allItems = await database.query.items.findMany();
//     const itemsWithUsers = await Promise.all(
//       allItems.map(async (item) => ({
//         ...item,
//         user: await getUserById(item.userId),
//       }))
//     );
//     return { items: itemsWithUsers, error: null };
//   } catch (error) {
//     console.error("Error fetching items with users:", error);
//     return { items: [], error: "Failed to fetch items" };
//   }
// });
export const getItemsWithUsers = cache(async () => {
  try {
    const { data: itemsWithUsers, error } = await supabase
      .from('items')
      .select(`
        *,
        user:users(*)
      `);

    if (error) {
      console.error("Error fetching items with users:", error);
      return { items: [], error: "Failed to fetch items" };
    }
    // console.log("itemsWithUsers", itemsWithUsers);

    return { items: itemsWithUsers, error: null };
  } catch (error) {
    console.error("Unexpected error fetching items with users:", error);
    return { items: [], error: "Failed to fetch items" };
  }
});

// export const getLiveAuctions = cache(async () => {
//   try { 
//     const { data: items, error } = await supabase
//       .from('items')
//       .select(`
//         *,
//         user:users(*)
//       `)
//       .gt('endDate', new Date().toISOString())

//     if (error) throw error
    
//     return items || []
//   } catch (error) {
//     console.error("Error fetching live auctions:", error)
//     return []
//   }
// });

export const getLiveAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  // console.log('items', items)
  return items
    .filter((item) => new Date(item.endDate + "Z") > new Date())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

export const getEndedAuctions = cache(async () => {
  const { items } = await getItemsWithUsers();
  return items.filter((item) => new Date(item.endDate + "Z") < new Date());
});

export const getUpcomingAuctions = cache(async (limit: number = 2) => {
  const { items } = await getItemsWithUsers();
  return items.slice(0, limit);
});
// export const getEndedAuctions = cache(async (limit:number) => {
//   try {
//     const { data: items, error } = await supabase
//       .from('items')
//       .select(`
//         *,
//         user:users(*)
//       `)
//       .lt('endDate', new Date().toISOString())
//       .limit(limit)

//     if (error) throw error
    
//     return items || []
//   } catch (error) {
//     console.error("Error fetching ended auctions:", error)
//     return []
//   }
// });

// export const getUpcomingAuctions = cache(async (limit: number = 2) => {
//   try {
//     const { data: items, error } = await supabase
//       .from('items')
//       .select(`
//         *,
//         user:users(*)
//       `)
//       .gt('endDate', new Date().toISOString())
//       .order('endDate', { ascending: true })
//       .limit(limit)

//     if (error) throw error
    
//     return items || []
//   } catch (error) {
//     console.error("Error fetching upcoming auctions:", error)
//     return []
//   }
// });


// export async function searchItems(query: string) {
//   if (!query) {
//     return [];
//   }

//   try {
//     const searchResults = await database.query.items.findMany({
//       where: ilike(items.name, `%${query}%`),
//       limit: 5,
//       columns: {
//         id: true,
//         name: true,
//         imageId: true,
//         currentBid: true,
//       },
//     });

//     return searchResults.map(item => ({
//       id: item.id.toString(), // Convert to string since id is serial
//       name: item.name,
//       imageUrl: item.imageId ||  null, // You might want to transform this to a full URL if needed
//       currentBid: item.currentBid
//     }));
//   } catch (error) {
//     console.error('Search error:', error);
//     return [];
//   }
// }
export async function searchItems(query: string) {
  if (!query) {
    return [];
  }

  try {
    const { data: searchResults, error } = await supabase
      .from('items')
      .select('id, name, imageId, currentBid')
      .ilike('name', `%${query}%`)
      .limit(5);

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    return searchResults.map(item => ({
      id: item.id.toString(), // Convert to string since id is serial
      name: item.name,
      imageUrl: item.imageId || null, // You might want to transform this to a full URL if needed
      currentBid: item.currentBid
    }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}


// Sign In
export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutWithGoogle() {
  await signOut({ redirectTo: "/" });
}

export const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("Sign-out successful");
    // Optionally redirect the user after sign-out
    window.location.href = "/";
  }
}