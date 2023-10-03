import type { WebSocket } from "ws";
import registerChatHandler from "./socket/handlers/chatHandler.js";
import { generateNumericId } from "./utils/id.js";
import { wss } from "./index.js";

export const clients = new Map<string, WebSocket>();
export const clientsMetadata = new Map<string, {}>();

function deserialize(callback: Function) {
  return function (data: Buffer) {
    try {
      const jsonData = JSON.parse(data.toString());
      callback(jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
}

export const setupWebSocketServer = () => {
  wss.on("listening", () => {
    console.log("listening apparently");
  });

  wss.on("connection", (ws) => {
    // TODO: Authentication
    console.log("client connected");

    const userId = generateNumericId(21);
    clients.set(userId, ws);

    ws.on("close", () => {
      clients.delete(userId);
      console.log("client disconnected");
    });

    ws.on(
      "message",
      deserialize((data: any) => {
        console.log("Received JSON data:", data);
      })
    );

    ws.on("ns:test", () => console.log("ns:test"));

    // Handlers
    registerChatHandler(ws, userId);
  });
};
