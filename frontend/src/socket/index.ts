import mitt from "mitt";

type Events = {
  error: { reason: string };
  "chat:message": {
    senderId: string;
    content: string;
    timestamp: number;
  };
};

type WebSocketEvent = {
  type: keyof Events;
  data: unknown;
};

const socketEmitter = mitt<Events>();

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  console.log("socket open");
});

socket.addEventListener("close", () => {
  console.log("socket close");
});

socket.addEventListener("message", (messageEvent) => {
  const event: WebSocketEvent = JSON.parse(messageEvent.data);

  switch (event.type) {
    case "chat:message":
      const chatMessageData = event.data as Events["chat:message"];
      socketEmitter.emit("chat:message", chatMessageData);
      break;
    case "error":
      const errorData = event.data as Events["error"];
      socketEmitter.emit("error", errorData);
      break;
    default:
      console.error("Unhandled socket event", event);
  }
});

export { socketEmitter };
export default socket;
