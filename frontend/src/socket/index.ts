import mitt from "mitt";
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
};

type WebSocketEvent = {
  type: keyof ServerToClientEvents;
  data: unknown;
};

const socketEmitter = mitt<ServerToClientEvents>();

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  console.log("socket open");
});

socket.addEventListener("close", () => {
  console.log("socket close");
});

socket.addEventListener("message", (messageEvent) => {
  const event: WebSocketEvent = JSON.parse(messageEvent.data);

  console.log({ event });

  socketEmitter.emit(
    event.type,
    event.data as ServerToClientEvents[typeof event.type]
  );
});

export { socketEmitter };
export default socket;
