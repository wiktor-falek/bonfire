// TODO: delete file
import { WebSocket } from "ws";
import { webSocketManager } from "./index.js";

export function send(ws: WebSocket, eventName: string, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: eventName, data }));
  }
}

export function broadcastSend(ws: WebSocket, eventName: string, data: any) {
  for (const client of webSocketManager.clients.values()) {
    if (client.ws.readyState === WebSocket.OPEN && client.ws !== ws) {
      client.ws.send(JSON.stringify({ type: eventName, data }));
    }
  }
}
