import bcrypt from "bcrypt";
import { Err, Ok } from "resultat";
import type Message from "../entities/message.js";

class MessageService {
  // send to a private channel between two users
  static async sendDirectMessage(
    senderId: string,
    recipientId: string,
    message: Message
  ) {
    const channelId = bcrypt.hashSync(senderId + recipientId, 0);
  }

  // retrieve n messages from a channel, optionally specify messages before certain timestamp (for pagination)
  static async getMessagesFromChannel(channelId: string, amount = 30) {
    return Err("Not Implemented");
  }
}

export default MessageService;
