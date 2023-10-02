import type { WebSocket } from "ws";
import { wss } from "./index.js";
import registerChatHandler from "./socket/handlers/chatHandler.js";
import { generateNumericId } from "./utils/id.js";

export const clients = new Map<string, WebSocket>();
export const clientsMetadata = new Map<string, {}>();

wss.on("connection", (ws) => {
  // TODO: Authentication

  const userId = generateNumericId(21);
  clients.set(userId, ws);

  ws.on("close", () => {
    clients.delete(userId);
  });

  // Handlers
  registerChatHandler(ws, userId);
});
