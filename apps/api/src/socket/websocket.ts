import { WebSocketServer, type WebSocket } from "ws";
import { generateNumericId } from "../utils/id.js";
import registerChatHandler from "./handlers/chatHandler.js";

export const wss = new WebSocketServer();
export const clients = new Map<string, WebSocket>();
export const clientsMetadata = new Map<string, {}>();

wss.on("connection", (ws) => {
  // TODO: Authentication

  // Setup
  const userId = generateNumericId(21);
  clients.set(userId, ws);

  ws.on("close", () => {
    clients.delete(userId);
  });

  registerChatHandler(ws, userId);

  // Handlers
});
