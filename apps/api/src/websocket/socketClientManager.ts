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
    // TODO: unsubscribe from all namespaces
    return this.clients.delete(id);
  }

  joinNamespace(namespace: string, client: WsClient) {
    const namespaceSet = this.namespaces.get(namespace) ?? new Set();
    namespaceSet.add(client);
    this.namespaces.set(namespace, namespaceSet);
  }

  leaveNamespace(namespace: string, client: WsClient) {
    const namespaceSet = this.namespaces.get(namespace);
    if (namespaceSet === undefined) {
      return false;
    }
    return this.namespaces.get(namespace)?.delete(client) ?? false;
  }

  getClientsFromNamespace(namespace: string) {
    return Array.from(this.namespaces.get(namespace) ?? []);
  }
}

export default SocketClientManager;
