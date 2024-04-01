import { ObjectId, type Db } from "mongodb";
import { Ok } from "resultat";
import type { Message } from "../../../domains/channels/interfaces/message.js";
import type { IChannelModel } from "../../../domains/channels/models/channel.interface.js";

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
