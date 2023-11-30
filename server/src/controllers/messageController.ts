import type { Request, Response } from "express";
import {
  postMessageSchema,
  getMessageSchema,
} from "../validators/messageValidators.js";
import { messageService } from "../instances.js";
import type { ValidatedRequest } from "../types.js";

export async function getMessages(
  req: Request & ValidatedRequest<typeof getMessageSchema>,
  res: Response
) {
  const { channelId, lastMessageId } = req.query;

  const result = await messageService.getMessagesFromChannel(channelId, {
    lastMessageId,
  });

  if (!result.ok) {
    return res.status(500).json({ error: result.err });
  }

  return res.status(200).json(result.val);
}

export async function saveDirectMessage(
  req: ValidatedRequest<typeof postMessageSchema>,
  res: Response
) {
  const { id: senderId } = res.locals.user;
  const { recipientId, content } = req.body;

  const result = await messageService.saveDirectMessage(
    senderId,
    recipientId,
    content
  );

  if (!result.ok) {
    return res.status(500).json({ error: result.err });
  }

  return res.status(200).json(result.val);
}
