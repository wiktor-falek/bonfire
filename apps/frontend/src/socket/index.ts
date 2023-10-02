// socket.ts
class WebSocketClient {
  private url: string | URL;
  socket?: WebSocket;
  isConnected: boolean;

  constructor(url: string | URL) {
    this.url = url;
    this.isConnected = false;
  }

  public connect(): WebSocket {
    if (this.isConnected) {
      return this.socket!;
    }

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      this.isConnected = true;
    });

    this.socket.addEventListener("close", () => {
      this.isConnected = false;
    });

    return this.socket!;
  }
}

export default WebSocketClient;
