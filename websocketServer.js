const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8082 });

let clients = new Set(); // Store clients

server.on('connection', (socket) => {
  // Add the new connection to the Set
  clients.add(socket);
  console.log('Client connected');
  console.log('Number of clients connected:', clients.size);

  // Notify all clients about the number of connected users
  broadcast({ type: 'userCount', count: clients.size });

  // Handle client disconnect
  socket.on('close', () => {
    clients.delete(socket); // Remove the client on disconnect
    console.log('Client disconnected');
    console.log('Number of clients connected:', clients.size);

    // Notify all clients about the updated user count
    broadcast({ type: 'userCount', count: clients.size });
  });
});

// Function to broadcast a message to all connected clients
function broadcast(message) {
    console.log('Broadcasting message:', message);
    console.log('Clients:', clients);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message)); // Send the message to each client
    }
  });
}

function broadcastNewBid(bidInfo) {
    console.log('Broadcasting new bid:', bidInfo);
    broadcast({
      type: 'newBid',
      itemId: bidInfo.itemId,
      newBid: bidInfo.newBid,
      bidInfo: bidInfo.bidInfo
    });
  }

module.exports = { broadcastNewBid };


console.log('WebSocket server is running on ws://localhost:8082');