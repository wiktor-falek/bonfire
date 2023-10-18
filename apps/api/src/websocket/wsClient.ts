import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { serialize, type JSONSerializable } from "./serialization.js";
import type SocketClientManager from "./socketClientManager.js";

export class WsClient {
  ws: WebSocket;
  id: string;
  constructor(ws: WebSocket, private socketClientManager: SocketClientManager) {
    this.ws = ws;
    this.id = uuidv4();
  }

  /**
   * Send event to this client.
   * @example
   * client.send("event", "Hello, client!");
   */
  send(eventName: string, data: JSONSerializable) {
    this._send(eventName, data, [this]);
  }

  /**
   * Omit this client.
   */
  get broadcast() {
    return {
      /**
       * Send event to all connected clients except this client.
       * @example
       * client.broadcast.sendToAll("event", "Hello, everyone except me!");
       */
      sendToAll: this.broadcastSendToAll,
    };
  }

  /**
   * Select clients that subscribe to the namespace.
   * @example
   * client.to("room").send("event", "Hello, room!");
   */
  to(namespace: string) {
    return {
      /**
       * Send event to all clients in the namespace.
       * @example
       * client.to("room").send("event", "Hello, room!");
       */
      send: (eventName: string, data: JSONSerializable) =>
        this.sendToNamespace(namespace, eventName, data),
      /**
       * Omit this client.
       */
      broadcast: {
        /**
         * Send event to all clients in the namespace except this client.
         * @example
         * client.to("room").broadcast.send("event", "Hello, everyone in the room except me!");
         */
        send: (eventName: string, data: JSONSerializable) =>
          this.broadcastSendToNamespace(namespace, eventName, data),
      },
    };
  }

  /**
   * Select client by id.
   * @example
   * client.toClient("client-id").send("event", "Hello, specific client!");
   */
  toClient(clientId: string) {
    return {
      /**
       * Send event to a client by id.
       * @example
       * client.toClient("client-id").send("event", "Hello, specific client!");
       */
      send: (eventName: string, data: JSONSerializable) =>
        this.sendToClient(clientId, eventName, data),
    };
  }

  /**
   * Send event to all connected clients.
   * @example
   * client.sendToAll("event", "Hello, all connected clients!");
   */
  sendToAll(eventName: string, data: JSONSerializable) {
    const clients = [...this.socketClientManager.clients.values()];
    this._send(eventName, data, clients);
  }

  private broadcastSendToAll(eventName: string, data: JSONSerializable) {
    const clients = [...this.socketClientManager.clients.values()];
    this._sendBroadcast(eventName, data, clients);
  }

  private sendToNamespace(
    namespace: string,
    eventName: string,
    data: JSONSerializable
  ) {
    const clients = this.socketClientManager.getClientsFromNamespace(namespace);
    this._send(eventName, data, clients);
  }

  private broadcastSendToNamespace(
    namespace: string,
    eventName: string,
    data: JSONSerializable
  ) {
    const clients = this.socketClientManager.getClientsFromNamespace(namespace);
    this._sendBroadcast(eventName, data, clients);
  }

  private sendToClient(
    clientId: string,
    eventName: string,
    data: JSONSerializable
  ) {
    const client = this.socketClientManager.clients.get(clientId);
    if (client) {
      this._send(eventName, data, [client]);
    }
  }

  private _send(
    eventName: string,
    data: JSONSerializable,
    clients: WsClient[]
  ) {
    // TODO: remove overhead of readyState check
    for (const client of clients) {
      if (this.ws.readyState === WebSocket.OPEN) {
        client.ws.send(serialize(eventName, data));
      }
    }
  }

  private _sendBroadcast(
    eventName: string,
    data: JSONSerializable,
    clients: WsClient[]
  ) {
    // TODO: remove overhead of readyState check
    for (const client of clients) {
      if (this.ws.readyState === WebSocket.OPEN && this.ws !== client.ws) {
        client.ws.send(serialize(eventName, data));
      }
    }
  }
}

export default WsClient;
