import type { MongoError, ObjectId } from "mongodb";
import type { Result } from "resultat";
import type { Channel } from "../interfaces/channel.js";
import type { Message } from "../interfaces/message.js";

export type IChannelModel = {
  saveDirectMessage(
    channelId: string,
    recipientId: string,
    message: Message
  ): Promise<Result<Message, string>>;
  getMessages(
    channelId: string,
    limit: number,
    lastMessageId?: ObjectId | string
  ): Promise<Result<Message[], MongoError | string>>;
  findChannelById(id: string): Promise<Result<Channel, string>>;
  findAllChannelIdsByUserId(userId: string): Promise<string[]>;
  addParticipantToChannel(userId: string, channelId: string): void;
  deleteParticipantFromChannel(userId: string, channelId: string): void;
};
