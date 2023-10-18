import type { WebSocketServer } from "ws";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize, type WebSocketEvent } from "./serialization.js";
import chatHandler from "./handlers/chatHandler.js";

function registerWebSocketServer(wss: WebSocketServer) {
  const socketClientManager = new SocketClientManager();

  wss.on("listening", () => {
    console.log("WebSocket server listening on ws://localhost:3000");
  });

  wss.on("connection", async (ws, req) => {
    console.log("connection");
    const client = socketClientManager.addClient(ws);

    const sessionId = getCookie("sessionId", req.headers.cookie);

    if (!sessionId) {
      return client.send("error", { reason: "Authentication Failed" });
    }

    const result = await sessionStore.getSession(sessionId);
    if (!result.ok) {
      return client.send("error", { reason: "Authentication Failed" });
    }

    const session = result.val;
    const { userId } = session;

    console.log(`User ${userId} connected with sesssion`, sessionId);

    ws.on("close", () => {
      socketClientManager.deleteClient(client.id);
      console.log(`User ${userId} disconnected`);
    });

    ws.on(
      "message",
      deserialize((event: WebSocketEvent) => {
        console.log(event.type);
        switch (event.type) {
          case "chat:direct-message":
            chatHandler.directMessage(client, event.data, userId);
            break;

          default:
            console.error("Unknown event type:", event.type);
        }
      })
    );
  });
}

export default registerWebSocketServer;
