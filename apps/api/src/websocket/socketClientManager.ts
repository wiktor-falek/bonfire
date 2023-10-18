import { WebSocket } from "ws";
import WsClient from "./wsClient.js";

class SocketClientManager {
  clients: Map<string, WsClient>;
  namespaces: Map<string, Set<WsClient>>;
  constructor() {
    this.clients = new Map();
    this.namespaces = new Map();
  }

  addClient(ws: WebSocket) {
    const client = new WsClient(ws, this);
    this.clients.set(client.id, client);
    return client;
  }

  deleteClient(id: string) {
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

export default SocketClientManager;
