import { directMessageHandler } from "./handlers/chatHandler.js";
import { wss } from "../index.js";
import { sessionStore } from "../instances.js";
import { send } from "./utils.js";
import getCookie from "../utils/getCookie.js";
import { deserialize, type WebSocketEvent } from "./serialization.js";
import WebSocketManager from "./webSocketManager.js";

export const webSocketManager = new WebSocketManager();

export const setupWebSocketServer = () => {
  wss.on("listening", () => {
    console.log("WebSocket server listening on ws://localhost:3000");
  });

  wss.on("connection", async (ws, req) => {
    const sessionId = getCookie("sessionId", req.headers.cookie);

    if (!sessionId) {
      return send(ws, "error", { reason: "Authentication Failed" });
    }

    const result = await sessionStore.getSession(sessionId);
    if (!result.ok) {
      return send(ws, "error", { reason: "Authentication Failed" });
    }

    const session = result.val;
    const { userId } = session;

    const client = webSocketManager.addClient(ws, userId);

    console.log(`User ${userId} connected with sesssion`, sessionId);

    ws.on("close", () => {
      webSocketManager.deleteClient(client.id);
      console.log(`User ${userId} disconnected`);
    });

    ws.on(
      "message",
      deserialize((event: WebSocketEvent) => {
        switch (event.type) {
          case "chat:direct-message":
            directMessageHandler(ws, event.data, userId);
            break;

          default:
            console.error("Unknown event type:", event.type);
        }
      })
    );
  });
};
