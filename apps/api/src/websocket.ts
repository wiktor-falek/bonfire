import type { WebSocket } from "ws";
import { directMessageHandler } from "./socket/handlers/chatHandler.js";
import { generateNumericId } from "./utils/id.js";
import { wss } from "./index.js";
import { z } from "zod";

export const clients = new Map<string, WebSocket>();
export const clientsMetadata = new Map<string, {}>();

const websocketEventSchema = z.object({
  type: z.string().min(1).max(128),
  data: z.any(),
});

export type WebSocketEvent = z.infer<typeof websocketEventSchema>;

function deserialize(callback: Function) {
  return (data: Buffer) => {
    try {
      const event = websocketEventSchema.parse(JSON.parse(data.toString()));
      console.log({ event });
      callback(event);
    } catch (error) {
      console.error("Parsing error");
    }
  };
}

export const setupWebSocketServer = () => {
  wss.on("listening", () => {
    console.log("WebSocket server listening on ws://localhost:3000");
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
      deserialize((event: WebSocketEvent) => {
        switch (event.type) {
          case "chat:message":
            directMessageHandler(ws, userId, event.data);
            break;

          default:
            console.error("Unknown event type:", event.type);
        }
      })
    );
  });
};
