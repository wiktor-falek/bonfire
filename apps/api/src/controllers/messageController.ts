import type { Response } from "express";
import type { RequestInfer } from "../types.js";
import type {
  messageQuerySchema,
  messageSchema,
} from "../validators/messageValidators.js";
import MessageService from "../services/messageService.js";

export async function getMessages(
  req: RequestInfer<typeof messageQuerySchema>,
  res: Response
) {
  const { channelId, lastMessageId } = req.body;

  const result = await MessageService.getMessagesFromChannel(channelId, {
    lastMessageId,
  });

  return !result.ok
    ? res.status(500).json({ error: result.err })
    : res.status(200).json(result.val);
}

export async function sendDirectMessage(
  req: RequestInfer<typeof messageSchema>,
  res: Response
) {
  const { id: senderId } = res.locals.user;
  const { recipientId, content } = req.body;
  const result = await MessageService.sendDirectMessage(
    senderId,
    recipientId,
    content
  );
  return !result.ok
    ? res.status(500).json({ error: result.err })
    : res.status(200).json(result.val);
}
