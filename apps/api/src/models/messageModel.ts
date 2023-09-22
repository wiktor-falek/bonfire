import Mongo from "../mongo.js";
import { Ok, Err } from "resultat";
import { z } from "zod";
import type Message from "../entities/message.js";
import { ObjectId, type Document } from "mongodb";

const messageSchema = z.object({
  senderId: z.string().length(18),
  content: z.string().trim().min(1).max(2000),
  timestamp: z.number(),
});

const channelMessageSchema = z.object({
  channelId: z.string().length(18),
  messages: z.array(messageSchema),
});

export type ChannelMessageType = z.infer<typeof channelMessageSchema>;

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

  static createIndexes() {
    return this.collection.createIndexes([
      {
        key: { channelId: 1 },
        unique: true,
      },
      {
        key: { "messages.timestamp": 1 },
      },
    ]);
  }

  static async sendToChannel(channelId: string, message: Message) {
    const result = await this.collection.updateOne(
      { channelId },
      {
        $setOnInsert: { channelId },
        $push: { messages: message },
      },
      { upsert: true }
    );

    return !result.acknowledged
      ? Err("Failed to write the message")
      : Ok(message);
  }

  static async getMessages(
    channelId: string,
    lastMessageId?: ObjectId | string
  ) {
    const pipeline: Document[] = [
      {
        $match: { channelId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages._id": -1 },
      },
    ];

    if (lastMessageId !== undefined) {
      pipeline.push({
        $match: {
          "messages._id": { $lt: new ObjectId(lastMessageId) },
        },
      });
    }

    pipeline.push(
      {
        $limit: 5,
      },
      {
        $replaceWith: "$messages",
      }
    );

    const result = await this.collection.aggregate(pipeline).toArray();

    return result;
  }
}

MessageModel.createIndexes();

export default MessageModel;
