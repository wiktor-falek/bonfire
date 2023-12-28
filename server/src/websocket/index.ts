import { WebSocket, type WebSocketServer } from "ws";
import type { ServerToClientEvents } from "./types.js";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize } from "./serialization.js";
import chatHandler from "./handlers/chatHandler.js";

const handlers = {
  "chat:direct-message": chatHandler.directMessage,
};

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
        return client.send("error", {
          reason: "Invalid data format",
        });
      }

      if (!Object.keys(handlers).includes(event.type)) {
        return client.send("error", {
          reason: `Unknown event type: ${event.type}`,
        });
      }

      const eventType = event.type as keyof typeof handlers;
      const { handler, schema } = handlers[eventType];

      const validation = schema.safeParse(event.data);

      if (!validation.success) {
        return client.send("error", { reason: "Invalid Schema" });
      }

      const validatedEventData = validation.data;

      handler(client, validatedEventData, userId);
    });
  });
}

export default registerWebSocketServer;
