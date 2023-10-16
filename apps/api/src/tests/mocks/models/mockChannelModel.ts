import { Ok, Err } from "resultat";
import {
  ObjectId,
  type Document,
  type MongoError,
  type Collection,
  type Db,
} from "mongodb";
import type { IChannelModel } from "../../../interfaces/channelModelInterface.js";
import Message from "../../../entities/message.js";

class MockChannelModel implements IChannelModel {
  constructor(db: Db) {}

  sendDirectMessage(channelId: string, recipientId: string, message: Message) {
    return Promise.resolve(Ok(message));
  }

  getMessages(
    channelId: string,
    limit: number,
    lastMessageId?: ObjectId | string
  ) {
    return Promise.resolve(Ok([]));
  }

  findChannelById(id: string) {
    const channel = {
      id: "mock_id",
      messages: [],
      participants: [],
    };
    return Promise.resolve(Ok(channel));
  }

  findAllChannelIdsByUserId(userId: string) {
    return Promise.resolve([] as string[]);
  }

  addParticipantToChannel(userId: string, channelId: string) {}

  removeParticipantFromChannel(userId: string, channelId: string) {}
}

export default MockChannelModel;
