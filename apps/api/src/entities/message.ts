import { ObjectId } from "mongodb";

class Message {
  _id: ObjectId;
  senderId: string;
  content: string;
  timestamp: number;

  constructor(senderId: string, content: string) {
    this._id = new ObjectId();
    this.senderId = senderId;
    this.content = content;
    this.timestamp = Date.now();
  }

  toJson() {
    return {
      senderId: this.senderId,
      content: this.content,
      timestamp: this.timestamp,
    };
  }
}

export default Message;
