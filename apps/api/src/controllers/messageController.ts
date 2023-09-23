import type { Response } from "express";
import type { RequestInfer } from "../types.js";
import type { messageSchema } from "../validators/messageValidators.js";
import MessageService from "../services/messageService.js";

export async function sendDirectMessage(
  req: RequestInfer<typeof messageSchema>,
  res: Response
) {
  const { id: senderId } = res.locals.user;
  const { recipientId, content } = req.body;
  MessageService.sendDirectMessage(senderId, recipientId, content);
  return res.status(500).json({ error: "Not Implemented" });
}
