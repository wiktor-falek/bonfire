import { v4 as uuidv4 } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { serialize, type JSONSerializable } from "./serialization.js";
import type SocketClientManager from "./socketClientManager.js";

type Key<Events> = Extract<keyof Events, string>;

export class WsClient<
  Events extends { [K in keyof Events]: JSONSerializable }
> {
  readonly ws: WebSocket;
  readonly id: string;
  constructor(
    ws: WebSocket,
    private socketClientManager: SocketClientManager<Events>
  ) {
    this.ws = ws;
    this.id = uuidv4();
  }

  /**
   * Send event to this client.
   * @example
   * client.send("event", "Hello, client!");
   */
  send<K extends Key<Events>>(eventName: K, data: Events[K]) {
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
       * client.broadcast.sendToAll("event", "Hello, all connected clients except me!");
       */
      sendToAll: this.broadcastSendToAll,
      /**
       * Select clients that subscribe to the namespace except this client.
       * @example
       * client.broadcast.to("room").send("event", "Hello, room!");
       */
      to: (namespace: string) => ({
        /**
         * Send event to all clients in the namespace except this client.
         * @example
         * client.broadcast.to("room").send("event", "Hello, everyone in the room except me!");
         */
        send: <K extends Key<Events>>(eventName: K, data: Events[K]) =>
          this.broadcastSendToNamespace(namespace, eventName, data),
      }),
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
      send: <K extends Key<Events>>(eventName: K, data: Events[K]) =>
        this.sendToNamespace(namespace, eventName, data),
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
      send: <K extends Key<Events>>(eventName: K, data: Events[K]) =>
        this.sendToClient(clientId, eventName, data),
    };
  }

  /**
   * Send event to all connected clients.
   * @example
   * client.sendToAll("event", "Hello, all connected clients!");
   */
  sendToAll<K extends Key<Events>>(eventName: K, data: Events[K]) {
    const clients = [...this.socketClientManager.clients.values()];
    this._send(eventName, data, clients);
  }

  /**
   * Subscribe to the specified namespace to receive events sent to it.
   */
  subscribe(namespace: string) {
    this.socketClientManager._joinNamespace(namespace, this);
  }

  /**
   * Unsubscribe from a specified namespace, ceasing to receive events sent to it.
   */
  unsubscribe(namespace: string) {
    this.socketClientManager._leaveNamespace(namespace, this);
  }

  private broadcastSendToAll<K extends Key<Events>>(
    eventName: K,
    data: Events[K]
  ) {
    const clients = [...this.socketClientManager.clients.values()];
    this._sendBroadcast(eventName, data, clients);
  }

  private sendToNamespace<K extends Key<Events>>(
    namespace: string,
    eventName: K,
    data: Events[K]
  ) {
    const clients =
      this.socketClientManager.getClientsFromNamespace(namespace);
    this._send(eventName, data, clients);
  }

  private broadcastSendToNamespace<K extends Key<Events>>(
    namespace: string,
    eventName: K,
    data: Events[K]
  ) {
    const clients =
      this.socketClientManager.getClientsFromNamespace(namespace);
    this._sendBroadcast(eventName, data, clients);
  }

  private sendToClient<K extends Key<Events>>(
    clientId: string,
    eventName: K,
    data: Events[K]
  ) {
    const client = this.socketClientManager.clients.get(clientId);
    if (client) {
      this._send(eventName, data, [client]);
    }
  }

  private _send<K extends Key<Events>>(
    eventName: K,
    data: Events[K],
    clients: WsClient<Events>[]
  ) {
    const length = clients.length;
    for (let i = 0; i < length; i++) {
      const client = clients[i]!;
      client.ws.send(serialize(eventName, data));
    }
  }

  private _sendBroadcast<K extends Key<Events>>(
    eventName: K,
    data: Events[K],
    clients: WsClient<Events>[]
  ) {
    const length = clients.length;
    for (let i = 0; i < length; i++) {
      const client = clients[i]!;
      if (this.ws !== client.ws) {
        client.ws.send(serialize(eventName, data));
      }
    }
  }
}

export class WsServerClient<
  Events extends { [K in keyof Events]: JSONSerializable }
> {
  readonly wss: WebSocketServer;
  readonly id: string;
  constructor(
    wss: WebSocketServer,
    private socketClientManager: SocketClientManager<Events>
  ) {
    this.wss = wss;
    this.id = uuidv4();
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
      send: <K extends Key<Events>>(eventName: K, data: Events[K]) =>
        this.sendToNamespace(namespace, eventName, data),
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
      send: <K extends Key<Events>>(eventName: K, data: Events[K]) =>
        this.sendToClient(clientId, eventName, data),
    };
  }

  /**
   * Send event to all connected clients.
   * @example
   * client.sendToAll("event", "Hello, all connected clients!");
   */
  sendToAll<K extends Key<Events>>(eventName: K, data: Events[K]) {
    const clients = [...this.socketClientManager.clients.values()];
    this._send(eventName, data, clients);
  }

  private sendToNamespace<K extends Key<Events>>(
    namespace: string,
    eventName: K,
    data: Events[K]
  ) {
    const clients =
      this.socketClientManager.getClientsFromNamespace(namespace);
    this._send(eventName, data, clients);
  }

  private sendToClient<K extends Key<Events>>(
    clientId: string,
    eventName: K,
    data: Events[K]
  ) {
    const client = this.socketClientManager.clients.get(clientId);
    if (client) {
      this._send(eventName, data, [client]);
    }
  }

  private _send<K extends Key<Events>>(
    eventName: K,
    data: Events[K],
    clients: WsClient<Events>[]
  ) {
    const length = clients.length;
    for (let i = 0; i < length; i++) {
      const client = clients[i]!;
      client.ws.send(serialize(eventName, data));
    }
  }
}
