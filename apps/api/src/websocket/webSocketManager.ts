import { WebSocket } from "ws";
import WsClient from "./wsClient.js";

class WebSocketManager {
  clients: Map<string, WsClient>;
  clientsMeta: Map<string, { userId: string }>;
  namespaces: Map<string, Set<WsClient>>;
  constructor() {
    this.clients = new Map();
    this.clientsMeta = new Map();
    this.namespaces = new Map();
  }

  addClient(ws: WebSocket, userId: string) {
    const client = new WsClient(ws, this);
    this.clients.set(client.id, client);
    this.clientsMeta.set(client.id, { userId });
    return client;
  }

  deleteClient(id: string) {
    this.clientsMeta.delete(id);
    return this.clients.delete(id);
  }

  joinNamespace(namespace: string, client: WsClient) {
    const namespaceSet = this.namespaces.get(namespace) ?? new Set();
    namespaceSet.add(client);
    return this.namespaces.set(namespace, namespaceSet);
  }

  getClientsFromNamespace(namespace: string) {
    return Array.from(this.namespaces.get(namespace) ?? []);
  }

  leaveNamespace(namespace: string) {
    return this.namespaces.delete(namespace);
  }
}

export default WebSocketManager;
