"use server"

import { auth } from "@/app/auth"
import { database } from "@/src/db/database";
import { bids, items } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { io } from "../../../websocketServer";

export async function createBidAction(itemId: number) {
    console.log('here too', itemId)
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        throw new Error("You must be logged in")
    }
    
    const item = await database.query.items.findFirst({
        where: eq(items.id, itemId)
    });

    if (!item) {
        throw new Error("Item not found!")
    }

    const latestBidValue = item.currentBid 
    ? item.currentBid + item.bidInterval 
    : item.startingPrice + item.bidInterval;

    await database.insert(bids).values({
        amount: latestBidValue,
        itemId,
        userId: session.user.id,
        timestamp: new Date(),
    })

    await database.update(items).set({
        currentBid: latestBidValue,
    }).where(eq(items.id, itemId))

    // Fetch the latest bid with user information
    const latestBid = await database.query.bids.findFirst({
        where: eq(bids.itemId, itemId),
        orderBy: desc(bids.id),
        with: {
            user: {
                columns: {
                    image: true,
                    name: true,
                },
            },
        },
    });
    
    // Emit the new bid to clients
    console.log('Emitting new bid:', { itemId, newBid: latestBidValue, bidInfo: latestBid });
    io.emit('newBid', {
        itemId,
        newBid: latestBidValue,
        bidInfo: latestBid,
    });

    revalidatePath(`/items/${itemId}`);
}  
