import type { Request, Response } from "express";
import {
  postMessageSchema,
  getMessageSchema,
} from "../validators/messageValidators.js";
import type { ValidatedRequest } from "../types.js";
import type MessageService from "../services/messageService.js";

class MessageController {
  constructor(private messageService: MessageService) {}

  async getMessages(
    req: Request & ValidatedRequest<typeof getMessageSchema>,
    res: Response
  ) {
    const { channelId, lastMessageId } = req.query;

    const result = await this.messageService.getMessagesFromChannel(channelId, {
      lastMessageId,
    });

    if (!result.ok) {
      return res.status(500).json({ error: result.err });
    }

    return res.status(200).json(result.val);
  }

  async saveDirectMessage(
    req: ValidatedRequest<typeof postMessageSchema>,
    res: Response
  ) {
    const { id: senderId } = res.locals.user;
    const { recipientId, content } = req.body;

    const result = await this.messageService.saveDirectMessage(
      senderId,
      recipientId,
      content
    );

    if (!result.ok) {
      return res.status(500).json({ error: result.err });
    }

    return res.status(200).json(result.val);
  }
}

export default MessageController;
