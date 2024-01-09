import mitt from "mitt";

type Events = {
  "chat:message": {
    senderId: string;
    content: string;
    timestamp: number;
  };
};

export const socketEmitter = mitt<Events>();

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  console.log("socket open");
});

socket.addEventListener("close", () => {
  console.log("socket close");
});

type WebSocketEvent = {
  type: string;
  data: any;
};

socket.addEventListener("message", (messageEvent) => {
  const event: WebSocketEvent = JSON.parse(messageEvent.data);
  console.log(event);
  switch (event.type) {
    case "chat:message":
      socketEmitter.emit("chat:message", event.data);
      break;
    default:
      console.log("Unhandled socket event", event);
  }
});

export default socket;
