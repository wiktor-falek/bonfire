import { WebSocket, type WebSocketServer } from "ws";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize } from "./serialization.js";
import chatHandler from "./handlers/chatHandler.js";

function registerWebSocketServer(wss: WebSocketServer) {
  const socketClientManager = new SocketClientManager();

  wss.on("listening", () => {
    console.log("WebSocket server listening on ws://localhost:3000");
  });

  wss.on("connection", async (ws, req) => {
    const client = socketClientManager.addClient(ws);

    const sessionId = getCookie("sessionId", req.headers.cookie);

    const result = await sessionStore.getSession(sessionId);
    if (!result.ok) {
      client.send("error", { reason: "Authentication Failed" });
      client.ws.close();
      socketClientManager.deleteClient(client);
      return;
    }

    const session = result.val;
    const { userId } = session;

    console.log(`User ${userId} connected with sesssion`, sessionId);

    // Subscribe all clients to a personal namespace of the user,
    // to allow sending events to all devices of that user.
    client.subscribe(`user_${userId}`);

    ws.on("close", () => {
      socketClientManager.deleteClient(client);
      console.log(`User ${userId} disconnected`);
    });

    ws.on("message", (data) => {
      if (ws.readyState !== WebSocket.OPEN) {
        return console.error(
          "Received message but connection is not fully open"
        );
      }

      const event = deserialize(data);
      if (event === null) {
        return console.error("Invalid data format");
      }

      switch (event.type) {
        case "chat:direct-message":
          chatHandler.directMessage(client, event.data, userId);
          break;

        default:
          console.error("Unknown event type:", event.type);
      }
    });
  });
}

export default registerWebSocketServer;
