import type { Response } from "express";
import type { RequestInfer } from "../types.js";
import type {
  messageQuerySchema,
  messageSchema,
} from "../validators/messageValidators.js";
import { messageService } from "../instances.js";

export async function getMessages(
  req: RequestInfer<typeof messageQuerySchema>,
  res: Response
) {
  const { channelId, lastMessageId } = req.body;

  const result = await messageService.getMessagesFromChannel(channelId, {
    lastMessageId,
  });

  if (!result.ok) {
    return res.status(500).json({ error: result.err });
  }

  return res.status(200).json(result.val);
}

export async function sendDirectMessage(
  req: RequestInfer<typeof messageSchema>,
  res: Response
) {
  const { id: senderId } = res.locals.user;
  const { recipientId, content } = req.body;

  const result = await messageService.sendDirectMessage(
    senderId,
    recipientId,
    content
  );

  if (!result.ok) {
    return res.status(500).json({ error: result.err });
  }

  return res.status(200).json(result.val);
}
