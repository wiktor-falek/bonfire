import { WebSocket, type WebSocketServer } from "ws";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize } from "./serialization.js";
import chatHandler from "./handlers/chatHandler.js";
import type { ServerToClientEvents } from "./types.js";

function registerWebSocketServer(wss: WebSocketServer) {
  const socketClientManager = new SocketClientManager<ServerToClientEvents>();

  wss.on("listening", () => {
    console.log("WebSocket server listening on ws://localhost:3000");
  });

  wss.on("connection", async (ws, req) => {
    const client = socketClientManager.addClient(ws);

    const sessionId = getCookie("sessionId", req.headers.cookie);

    const result = await sessionStore.getSession(sessionId);
    if (!result.ok) {
      client.send("error", { reason: "Authentication Failed" });
      return socketClientManager.deleteClient(client);
    }

    const session = result.val;
    const { userId } = session;

    console.log(`User ${userId} connected with sesssion ${sessionId}`);

    // Subscribe the client to a personal namespace of the user.
    // This enables sending events to all connected devices of that user,
    // by using client.to(`user_${userId}`).send(...)
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
        // TODO: schema validation, pass inferred type of data to the handler
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
