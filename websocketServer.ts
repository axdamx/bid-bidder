// // websocketServer.ts
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors'; // Import cors

// const app = express();
// const server = http.createServer(app);
// export const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Replace with your frontend URL
//         methods: ["GET", "POST"], // Specify allowed methods
//         credentials: true, // Allow credentials
//     }
// }); // Configure CORS options for Socket.IO

// let connectedUsers = 0;

// app.use(cors()); // Use CORS middleware for Express if necessary

// export const broadcastNewBid = (itemId: number, newBid: number, bidInfo: any) => {
//   io.emit('newBid', {
//       itemId,
//       newBid,
//       bidInfo,
//   });
// };

// io.on('connection', (socket) => {
//     console.log('A user connected');
//     connectedUsers++;

//     io.emit('userCount', connectedUsers);

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//         connectedUsers--;
//         io.emit('userCount', connectedUsers);
//     });

//     socket.on('newBid', (data) => {
//       console.log('A new bid', data);
//       const { itemId, newBid, bidInfo } = data;
//       io.emit('newBid', {
//         itemId,
//         newBid,
//         bidInfo,
//     });
//   });
// });

// const PORT = 8082;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

export const broadcastNewBid = (itemId: number, newBid: number, bidInfo: any) => {
  io.to(`item_${itemId}`).emit('newBid', {
      itemId,
      newBid,
      bidInfo,
  }); // Broadcast only to users in the room for that item
  console.log(`New bid broadcasted to room: item_${itemId}`);
};

io.on('connection', (socket) => {
    console.log('A user connected, socket ID:', socket.id);

    // When a user joins an item listing (for example, when they view an item)
    socket.on('joinItem', (itemId) => {
        console.log(`User with socket ID: ${socket.id} joined item_${itemId}`);
        socket.join(`item_${itemId}`); // Join the room for the specific item
        
        // Get the number of users in the room for the item
        const room = io.sockets.adapter.rooms.get(`item_${itemId}`);
        const usersInRoom = room ? room.size : 0;

        console.log(`Total users in room item_${itemId}: ${usersInRoom}`);
        
        // Broadcast the user count to all users in this item listing
        io.to(`item_${itemId}`).emit('userCount', usersInRoom);
    });

    // When a user leaves the item (optional)
    socket.on('leaveItem', (itemId) => {
        console.log(`User with socket ID: ${socket.id} left item_${itemId}`);
        socket.leave(`item_${itemId}`); // Leave the room for the specific item
        
        // Update the user count in the room
        const room = io.sockets.adapter.rooms.get(`item_${itemId}`);
        const usersInRoom = room ? room.size : 0;

        console.log(`Total users in room item_${itemId} after user left: ${usersInRoom}`);
        io.to(`item_${itemId}`).emit('userCount', usersInRoom);
    });

    // Handle bidding
    socket.on('newBid', (data) => {
        const { itemId, newBid, bidInfo } = data;
        console.log(`New bid received for item_${itemId} from socket ID: ${socket.id}`);
        console.log(`Bid details - Item ID: ${itemId}, Bid: ${newBid}`);

        // Broadcast the bid only to users in the room for that item
        io.to(`item_${itemId}`).emit('newBid', {
            itemId,
            newBid,
            bidInfo,
        });

        console.log(`New bid broadcasted in room item_${itemId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User with socket ID: ${socket.id} disconnected`);
        // Optionally handle user count updates if needed
    });
});

const PORT = 8082;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});