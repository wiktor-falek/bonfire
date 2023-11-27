import { Ok } from "resultat";
import { ObjectId, type Db } from "mongodb";
import type { IChannelModel } from "../../../interfaces/channelModelInterface.js";
import { type Message } from "../../../entities/message.js";

class MockChannelModel implements IChannelModel {
  constructor(db: Db) {}

  saveDirectMessage(channelId: string, recipientId: string, message: Message) {
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

  deleteParticipantFromChannel(userId: string, channelId: string) {}
}

export default MockChannelModel;
