import { Ok, Err } from "resultat";
import { z } from "zod";
import type Message from "../entities/message.js";
import { ObjectId, type Document, MongoError, Collection, Db } from "mongodb";

const messageSchema = z.object({
  senderId: z.string().length(18),
  content: z.string().trim().min(1).max(2000),
  timestamp: z.number(),
});

const channelMessageSchema = z.object({
  channelId: z.string().length(18),
  messages: z.array(messageSchema),
});

export type MessageType = z.infer<typeof messageSchema>;

export type ChannelMessageType = z.infer<typeof channelMessageSchema>;

class MessageModel {
  private db: Db;
  private collection: Collection<Document>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection("messages");
  }

  createIndexes() {
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

  async sendToChannel(channelId: string, message: Message) {
    const result = await this.collection.updateOne(
      { channelId },
      {
        $setOnInsert: { channelId },
        $push: { messages: message },
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      return Err("Failed to write the message");
    }

    return Ok(message);
  }

  async getMessages(
    channelId: string,
    limit: number,
    lastMessageId?: ObjectId | string
  ) {
    // TODO: return Err() if channel does not exist instead of Ok([])

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
        $limit: limit,
      },
      {
        $replaceWith: "$messages",
      },
      {
        $project: { _id: 0 },
      }
    );

    try {
      const result = await this.collection
        .aggregate<MessageType>(pipeline)
        .toArray();
      return Ok(result);
    } catch (e) {
      return Err(e as MongoError);
    }
  }
}

export default MessageModel;
