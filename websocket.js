const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });

server.on('connection', (socket) => {
  console.log('Client connected');
  socket.send('Hello from server');

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');