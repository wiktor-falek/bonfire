import mitt, { type Emitter } from "mitt";
import { UserStatus, type UserProfile } from "../api/users";

type ServerToClientEvents = {
  error: { reason: string };
  clientId: string;
  "chat:message": {
    senderId: string;
    content: string;
    timestamp: number;
  };
  userProfiles: UserProfile[];
  "subscription:user-profile:status": { profileId: string; status: UserStatus };
  "subscription:user-profile:displayName": {
    profileId: string;
    displayName: string;
  };
  "relation:friend-invite": { profile: UserProfile };
};

type ClientToServerEvents = {
  "chat:direct-message": {
    recipientId: string;
    content: string;
  };
  "subscribe:user-profiles": { profileIds: string[] };
  "unsubscribe:user-profiles": { profileIds: string[] };
};

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
        this.socket?.send(data);
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

      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        const { type, data } = this.queue[i]!;
        this.emit(type, data);
      }
      this.queue = [];
    });
  }

  emit<K extends keyof ClientToServerEvents>(
    type: K,
    data: ClientToServerEvents[K]
  ) {
    if (!this.isOpen || !this.socket) {
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
