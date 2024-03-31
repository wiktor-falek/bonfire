import { ObjectId } from "mongodb";
import type { Message } from "../interfaces/message.js";

export function createMessage(senderId: string, content: string): Message {
  return {
    _id: new ObjectId().toString(),
    senderId,
    content,
    timestamp: Date.now(),
  };
}
