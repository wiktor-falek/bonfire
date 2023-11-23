import type { Message } from "../entities/message.js";

export type ServerToClientEvents = {
  error: { reason: string };
  "chat:message": Message;
  "ACK_chat:message": null;
};
