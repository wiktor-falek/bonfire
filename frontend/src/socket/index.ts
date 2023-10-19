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
      // TODO: emit event
      const content = event.data as string;
      break;
    default:
  }
});

export default socket;
