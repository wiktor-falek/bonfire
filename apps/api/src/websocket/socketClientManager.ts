import { WebSocket } from "ws";
import WsClient from "./wsClient.js";

class SocketClientManager {
  // client.id to WsClient instance mapping.
  clients: Map<string, WsClient>;

  // Namespace to subscribed clients mapping.
  private namespaces: Map<string, Set<WsClient>>;

  // client.id to subscribed namespaces mapping.
  private clientSubscribedNamespaces: Map<string, Set<string>>;
  constructor() {
    this.clients = new Map();
    this.namespaces = new Map();
    this.clientSubscribedNamespaces = new Map();
  }

  addClient(ws: WebSocket) {
    const client = new WsClient(ws, this);
    this.clients.set(client.id, client);
    return client;
  }

  deleteClient(client: WsClient) {
    // unsubscribe from all namespaces
    const namespaces = this.clientSubscribedNamespaces.get(client.id);
    if (namespaces) {
      for (const ns of namespaces) {
        this.namespaces.get(ns)?.delete(client);
      }
    }

    return this.clients.delete(client.id);
  }

  _joinNamespace(namespace: string, client: WsClient) {
    const namespaceSet = this.namespaces.get(namespace) ?? new Set();
    namespaceSet.add(client);
    this.namespaces.set(namespace, namespaceSet);

    // Associate the client with the specified namespace and maintain a two-way mapping
    // to track which namespaces the client is subscribed to. This allows for a scalable
    // way of removing the client from all namespaces.
    const clientNamespacesSet =
      this.clientSubscribedNamespaces.get(client.id) ?? new Set();
    clientNamespacesSet.add(namespace);
    this.clientSubscribedNamespaces.set(client.id, clientNamespacesSet);
  }

  _leaveNamespace(namespace: string, client: WsClient) {
    const namespaceSet = this.namespaces.get(namespace);
    if (namespaceSet === undefined) {
      return false;
    }

    this.clientSubscribedNamespaces.get(client.id)?.delete(namespace);

    return this.namespaces.get(namespace)?.delete(client) ?? false;
  }

  _getClientsFromNamespace(namespace: string) {
    return Array.from(this.namespaces.get(namespace) ?? []);
  }
}

export default SocketClientManager;
