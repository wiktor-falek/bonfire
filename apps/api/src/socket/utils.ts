import { WebSocket } from "ws";
import { clients } from "../websocket.js";

export function send(ws: WebSocket, eventName: string | symbol, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: eventName, data }));
  }
}

export function broadcastSend(
  ws: WebSocket,
  eventName: string | symbol,
  data: any
) {
  for (const client of clients.values()) {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({ type: eventName, data }));
    }
  }
}
