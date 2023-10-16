import type { WebSocket } from "ws";
import { directMessageHandler } from "./socket/handlers/chatHandler.js";
import { wss } from "./index.js";
import { z } from "zod";
import { sessionStore } from "./instances.js";
import { send } from "./socket/utils.js";
import getCookie from "./utils/getCookie.js";

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

  wss.on("connection", async (ws, req) => {
    const sessionId = getCookie("sessionId", req.headers.cookie);

    if (!sessionId) {
      return send(ws, "error", { reason: "Authentication Failed" });
    }

    const result = await sessionStore.getSession(sessionId);
    if (!result.ok) {
      return send(ws, "error", { reason: "Authentication Failed" });
    }

    console.log("Client connected with sesssion", sessionId);

    const session = result.val;
    const { userId } = session;

    clients.set(userId, ws);

    ws.on("close", () => {
      clients.delete(userId);
      console.log("Client disconnected");
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
