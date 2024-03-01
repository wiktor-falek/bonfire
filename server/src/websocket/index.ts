import { WebSocket, type WebSocketServer } from "ws";
import type { ServerToClientEvents } from "./types.js";
import SocketClientManager from "./socketClientManager.js";
import getCookie from "../utils/getCookie.js";
import { sessionStore } from "../instances.js";
import { deserialize } from "./serialization.js";
import { WsClient, WsServerClient } from "./wsClient.js";
import type { AnyZodObject } from "zod";

// TODO: any strict zod object

class WebSocketApp {
  private handlers: {
    [key: string]: {
      cb: (
        client: WsClient<ServerToClientEvents>,
        data: unknown,
        userId: string
      ) => any;
      schema: AnyZodObject;
    };
  };
  private registered: boolean;
  constructor() {
    this.handlers = {};
    this.registered = false;
  }

  bind(
    eventType: string,
    cb: (
      client: WsClient<ServerToClientEvents>,
      data: any,
      userId: string
    ) => any,
    schema: AnyZodObject
  ) {
    if (this.registered) {
      throw new Error("Cannot bind after registering");
    }

    if (eventType in this.handlers) {
      throw new Error(`Handler already registered for event '${eventType}'`);
    }

    this.handlers[eventType] = { cb, schema };
  }

  register(wss: WebSocketServer, options: { onClose?: Function }) {
    const socketClientManager = new SocketClientManager<ServerToClientEvents>();
    const wsServerClient = new WsServerClient<ServerToClientEvents>(
      wss,
      socketClientManager
    );

    wss.on("listening", () => {
      console.log("WebSocket server listening on ws://localhost:3000");
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

      console.log(`User ${userId} connected with sesssion ${sessionId}`);

      // Subscribe the client to a personal namespace of the user.
      // This enables sending events to all connected devices of that user,
      // by using client.to(`user_${userId}`).send(...)
      client.subscribe(`user_${userId}`);

      ws.on("close", () => {
        options.onClose?.();
        socketClientManager.deleteClient(client);
        console.log(`User ${userId} disconnected`);
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

    return [wsServerClient, socketClientManager] as const;
  }
}

export default WebSocketApp;
