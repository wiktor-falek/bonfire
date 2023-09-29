import type { Request, Response } from "express";
import {
  messageQuerySchema,
  type messageSchema,
} from "../validators/messageValidators.js";
import { messageService } from "../instances.js";
import type { z } from "zod";

export async function getMessages(
  req: Request & z.infer<typeof messageQuerySchema>,
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

export async function sendDirectMessage(
  req: Request & z.infer<typeof messageSchema>,
  res: Response
) {
  const { id: senderId } = res.locals.user;
  const { recipientId, content } = req.body;

  console.log(req.body);

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
