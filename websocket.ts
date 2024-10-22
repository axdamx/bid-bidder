import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json()); // Add this line to parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.post("/api/bids", (req, res) => {
  const { itemId, newBid, bidInfo } = req.body;

  console.log("Received bid update HTTP request:", { itemId, newBid, bidInfo });

  // Emit to the specific room
  io.to(`item_${itemId}`).emit("newBid", {
    itemId,
    newBid,
    bidInfo,
  });

  res.json({ success: true });
});

io.on("connection", (socket) => {
  console.log("A user connected, socket ID:", socket.id);

  // When a user joins an item listing (for example, when they view an item)
  socket.on("joinItem", (itemId) => {
    console.log(`User with socket ID: ${socket.id} joined item_${itemId}`);
    socket.join(`item_${itemId}`); // Join the room for the specific item

    // Get the number of users in the room for the item
    const room = io.sockets.adapter.rooms.get(`item_${itemId}`);
    const usersInRoom = room ? room.size : 0;

    console.log(`Total users in room item_${itemId}: ${usersInRoom}`);

    // Broadcast the user count to all users in this item listing
    io.to(`item_${itemId}`).emit("userCount", usersInRoom);
  });

  // Handle bidding
  socket.on("newBid", (data) => {
    const { itemId, newBid, bidInfo } = data;
    console.log(
      `New bid received for item_${itemId} from socket ID: ${socket.id}`
    );
    console.log(`Bid details - Item ID: ${itemId}, Bid: ${newBid}`);

    // Broadcast the bid only to users in the room for that item
    io.to(`item_${itemId}`).emit("newBid", {
      itemId,
      newBid,
      bidInfo,
    });

    console.log(`New bid broadcasted in room item_${itemId}`);
  });

  // When a user leaves the item (optional)
  socket.on("leaveItem", (itemId) => {
    console.log(`User with socket ID: ${socket.id} left item_${itemId}`);
    socket.leave(`item_${itemId}`); // Leave the room for the specific item

    // Update the user count in the room
    const room = io.sockets.adapter.rooms.get(`item_${itemId}`);
    const usersInRoom = room ? room.size : 0;

    console.log(
      `Total users in room item_${itemId} after user left: ${usersInRoom}`
    );
    io.to(`item_${itemId}`).emit("userCount", usersInRoom);
  });

  socket.on("disconnect", () => {
    console.log(`User with socket ID: ${socket.id} disconnected`);
    // Optionally handle user count updates if needed
  });
});

export { server };
