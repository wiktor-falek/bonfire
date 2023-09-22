import { ObjectId } from "mongodb";

class Message {
  _id: ObjectId;
  senderId: string;
  content: string;
  timestamp: number;
  constructor(senderId: string, content: string, timestamp?: number) {
    this._id = new ObjectId();
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp ?? Date.now();
  }
}

export default Message;
