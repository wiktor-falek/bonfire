import { WebSocket, type WebSocketServer } from "ws";
import type { ServerToClientEvents } from "./types.js";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize } from "./serialization.js";
import { WsClient, WsServerClient } from "./wsClient.js";
import type { AnyZodObject } from "zod";
import type { IncomingMessage } from "node:http";

type Handler = (
  client: WsClient<ServerToClientEvents>,
  data: any,
  userId: string
) => any;

type Schema = AnyZodObject;

type HandlerWithSchema = {
  cb: Handler;
  schema: Schema;
};

type OnListeningHandler = () => any;
type OnConnectionHandler = (
  client: WsClient<ServerToClientEvents>,
  req: IncomingMessage,
  userId: string
) => any;
type OnCloseHandler = (
  client: WsClient<ServerToClientEvents>,
  userId: string
) => any;

class WebSocketApp {
  private listening: boolean = false;
  private handlers: Record<string, HandlerWithSchema> = {};
  private onListeningHandler: OnListeningHandler | null = null;
  private onConnectionHandler: OnConnectionHandler | null = null;
  private onCloseHandler: OnCloseHandler | null = null;
  constructor() {}

  register(eventType: string, cb: Handler, schema: Schema) {
    if (this.listening) {
      throw new Error("Cannot register event handler after listening");
    }

    if (eventType in this.handlers) {
      throw new Error(`Handler already registered for event '${eventType}'`);
    }

    this.handlers[eventType] = { cb, schema };

    return this;
  }

  onListening(cb: OnListeningHandler) {
    if (this.listening) {
      throw new Error("Cannot register handler after listening");
    }

    if (this.onListeningHandler !== null)
      throw new Error("Handler 'onListening' has already been defined");
    this.onListeningHandler = cb;
    return this;
  }

  onConnection(
    cb: (
      client: WsClient<ServerToClientEvents>,
      req: IncomingMessage,
      userId: string
    ) => any
  ) {
    if (this.onConnectionHandler !== null)
      throw new Error("Handler 'onConnection' has already been defined");
    this.onConnectionHandler = cb;
    return this;
  }

  onClose(cb: OnCloseHandler) {
    if (this.onCloseHandler !== null)
      throw new Error("Handler 'onClose' has already been defined");
    this.onCloseHandler = cb;
    return this;
  }

  listen(wss: WebSocketServer) {
    const socketClientManager = new SocketClientManager<ServerToClientEvents>();
    const wsServerClient = new WsServerClient<ServerToClientEvents>(
      wss,
      socketClientManager
    );

    wss.on("listening", () => {
      this.onListeningHandler?.();
    });

    wss.on("connection", async (ws, req) => {
      const client = socketClientManager.addClient(ws);

      const sessionId = getCookie("sessionId", req.headers.cookie);

      const result = await sessionStore.getSession(sessionId);
      if (!result.ok) {
        client.send("error", { reason: "Authentication Failed" });
        return socketClientManager.deleteClient(client);
      }

      // send the clientId for the client to store it as a cookie, later
      // it will used for http requests that need to identify the client
      client.send("clientId", client.id);

      const session = result.val;
      const { userId } = session;

      // Subscribe the client to a personal namespace of the user.
      // This enables sending events to all connected devices of that user,
      // by using client.to(`user_${userId}`).send(...)
      client.subscribe(`user_${userId}`);

      this.onConnectionHandler?.(client, req, userId);

      ws.on("close", () => {
        socketClientManager.deleteClient(client);
        this.onCloseHandler?.(client, userId);
      });

      ws.on("message", (data) => {
        if (ws.readyState !== WebSocket.OPEN) {
          return console.error(
            "Received message but connection is not fully open"
          );
        }

        const event = deserialize(data);
        if (event === null) {
          return client.send("error", {
            reason: "Invalid data format",
          });
        }

        const handler = this.handlers[event.type];
        if (handler === undefined) {
          return client.send("error", {
            reason: `Unknown event type: ${event.type}`,
          });
        }

        const { cb, schema } = handler;

        const validation = schema.safeParse(event.data);

        if (!validation.success) {
          return client.send("error", { reason: "Invalid Schema" });
        }

        cb(client, validation.data, userId);
      });
    });

    return { wsServerClient, socketClientManager } as const;
  }
}

export default WebSocketApp;
