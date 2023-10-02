import { WebSocket } from "ws";
import { clients } from "../websocket.js";

export function broadcastEmit(
  ws: WebSocket,
  eventName: string | symbol,
  ...args: any[]
) {
  for (const client of clients.values()) {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({ event: eventName, data: args }));
    }
  }
}
