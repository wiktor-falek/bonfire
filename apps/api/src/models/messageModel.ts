import bcrypt from "bcrypt";
import Mongo from "../mongo.js";
import { Ok, Err } from "resultat";
import { z } from "zod";
import type Message from "../entities/message.js";

const messageSchema = z.object({});

/*
users [
  { id: string, ... },
]

channels [
  { id: string, name?: string, participants: string[], ... },
]

messages [
  { channelId: string, messages: Message[] },
]
*/

class MessageModel {
  private static db = Mongo.getClient().db("bonfire");
  private static collection = this.db.collection("messages");

  static async sendToChannel(
    channelId: string,
    senderId: string,
    message: Message
  ) {
    // const updateResult = await this.collection.findOneAndUpdate(
    //   { channelId },
    //   {
    //     $setOnInsert: { sessionId },
    //     $addToSet: { messages: {} },
    //   },
    //   { upsert: true }
    // );
  }
}

export default MessageModel;
