import bcrypt from "bcrypt";
import Mongo from "../mongo.js";
import { Ok, Err } from "resultat";
import { z } from "zod";
import type Message from "../entities/message.js";
import type { WithoutId } from "mongodb";

// TODO: better naming

const channelMessageSchema = z.object({
  channelId: z.string().length(18),
  messages: z.array(
    z.object({
      senderId: z.string().length(18),
      content: z.string().trim().min(1).max(2000),
      timestamp: z.number(),
    })
  ),
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
  private static collection =
    this.db.collection<WithoutId<ChannelMessageType>>("messages");

  static async sendToChannel(
    channelId: string,
    message: Message
  ) {
    // upsert document { channelId: string, messages: Message[] } if not found
    const channelMessage = await this.collection.findOneAndUpdate(
      { channelId },
      {
        $setOnInsert: { channelId },
        $push: { messages: message },
      },
      { upsert: true, projection: { _id: 0 } }
    );

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
