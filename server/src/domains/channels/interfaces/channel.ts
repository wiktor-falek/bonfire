import type { Message } from "../interfaces/message.js";

export type Channel = {
  id: string;
  messages: Message[];
  participants: string[];
};
