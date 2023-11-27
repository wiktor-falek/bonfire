import type { Result } from "resultat";
import type { Message } from "../entities/message.js";
import type { MongoError, ObjectId } from "mongodb";

export type ChannelType = {
  id: string;
  messages: Message[];
  participants: string[];
};

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
  findChannelById(id: string): Promise<Result<ChannelType, string>>;
  findAllChannelIdsByUserId(userId: string): Promise<string[]>;
  addParticipantToChannel(userId: string, channelId: string): void;
  deleteParticipantFromChannel(userId: string, channelId: string): void;
};
