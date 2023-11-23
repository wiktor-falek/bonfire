import { ObjectId } from "mongodb";

export type Message = {
  _id: string;
  senderId: string;
  content: string;
  timestamp: number;
};

export function createMessage(senderId: string, content: string): Message {
  return {
    _id: new ObjectId().toString(),
    senderId,
    content,
    timestamp: Date.now(),
  };
}
