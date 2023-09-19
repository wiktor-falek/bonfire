class Message {
  senderId: string;
  content: string;
  timestamp: number;
  constructor(senderId: string, content: string, timestamp?: number) {
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp ?? Date.now();
  }
}

export default Message;
