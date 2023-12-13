import type { ObjectId } from "mongodb";
import type ChannelModel from "../models/channelModel.js";
import { Err } from "resultat";
import { createMessage } from "../entities/message.js";
import { messageEntitySchema } from "../validators/messageValidators.js";
import { getDirectMessageChannelId } from "../utils/id.js";

class MessageService {
  constructor(private channelModel: ChannelModel) {}

  /**
   * Appends a message to a channel between two users.
   */
  async saveDirectMessage(
    senderId: string,
    recipientId: string,
    content: string
  ) {
    const channelId = getDirectMessageChannelId(senderId, recipientId);
    const message = createMessage(senderId, content);

    const validation = messageEntitySchema.safeParse(message);

    if (!validation.success) {
      return Err("Schema validation failed");
    }

    return this.channelModel.saveDirectMessage(channelId, recipientId, message);
  }

  /**
   * Retrieve messages from a channel, optionally specify amount of messages,
   * or appearing before a certain messageId for pagination.
   */
  async getMessagesFromChannel(
    channelId: string,
    options?: { amount?: number; lastMessageId?: string | ObjectId }
  ) {
    const { amount = 30, lastMessageId } = options!;
    return this.channelModel.getMessages(channelId, amount, lastMessageId);
  }
}

export default MessageService;
