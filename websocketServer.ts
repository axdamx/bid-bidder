// websocketServer.ts
import { server } from "./websocket"; // Import the server, which already has the io logic

const PORT = 8082;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
