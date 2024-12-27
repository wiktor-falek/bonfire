import mitt, { type Emitter } from "mitt";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

type WebSocketEvent = {
  type: keyof ServerToClientEvents;
  data: unknown;
};

type QueueEvent<ClientToServerK extends keyof ClientToServerEvents> = {
  type: ClientToServerK;
  data: ClientToServerEvents[ClientToServerK];
};

const HEARTBEAT_VALUE = 69;

class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: WebSocket | undefined;
  private isOpen: boolean;
  private emitter: Emitter<ServerToClientEvents>;
  private queue: QueueEvent<keyof ClientToServerEvents>[];

  private constructor() {
    this.isOpen = false;
    this.emitter = mitt();
    this.queue = [];
  }

  static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  connect() {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(
      import.meta.env.VITE_API_URL ?? "ws://localhost:3000"
    );

    this.socket.addEventListener("open", () => {
      console.log("socket open");
    });

    this.socket.addEventListener("close", () => {
      console.log("socket close");
    });

    this.socket.addEventListener("message", (messageEvent) => {
      const isBinary =
        messageEvent.data instanceof ArrayBuffer ||
        messageEvent.data instanceof Blob;

      if (isBinary) {
        console.log("ping");
        const data = new Uint8Array(1);
        data[0] = HEARTBEAT_VALUE;
        this.socket?.send(data); // pong back to keep connection alive
        return;
      }

      const event: WebSocketEvent = JSON.parse(messageEvent.data);
      this.emitter.emit(
        event.type,
        event.data as ServerToClientEvents[typeof event.type]
      );
    });

    this.socket.addEventListener("open", () => {
      this.isOpen = true;

      for (const { type, data } of this.queue) {
        this.emit(type, data);
      }
      this.queue = [];
    });
  }

  emit<K extends keyof ClientToServerEvents>(
    type: K,
    data: ClientToServerEvents[K]
  ) {
    if (!this.socket || !this.isOpen) {
      this.queue.push({ type, data });
      return;
    }

    this.socket.send(
      JSON.stringify({
        type,
        data,
      })
    );
  }

  on<K extends keyof ServerToClientEvents>(
    type: K,
    cb: (data: ServerToClientEvents[K]) => any
  ) {
    this.emitter.on(type, cb);
  }
}

export default WebSocketClient;
