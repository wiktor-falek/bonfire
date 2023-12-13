import type { Message } from "../entities/message.js";
import { Ok, Err } from "resultat";
import {
  ObjectId,
  type Document,
  type MongoError,
  type Collection,
  type Db,
} from "mongodb";
import type {
  IChannelModel,
  ChannelType,
} from "../interfaces/channelModelInterface.js";

class ChannelModel implements IChannelModel {
  private db: Db;
  private collection: Collection<ChannelType>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<ChannelType>("channels");
  }

  async saveDirectMessage(
    channelId: string,
    recipientId: string,
    message: Message
  ) {
    const result = await this.collection.updateOne(
      { id: channelId },
      {
        $setOnInsert: {
          id: channelId,
          participants: [message.senderId, recipientId],
        },
        $push: {
          messages: message,
        },
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
    const channelExists =
      (await this.collection.countDocuments({ id: channelId })) !== 0;

    if (!channelExists) {
      return Ok([]);
    }

    const pipeline: Document[] = [
      {
        $match: { id: channelId },
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
        .aggregate<Message>(pipeline)
        .toArray();
      return Ok(result);
    } catch (e) {
      return Err(e as MongoError);
    }
  }

  async findChannelById(id: string) {
    const channel = await this.collection.findOne(
      { id: id },
      { projection: { _id: 0, messages: 0 } }
    );

    if (channel === null) {
      return Err(`Channel with id=${id} does not exist`);
    }

    return Ok(channel);
  }

  async findAllChannelIdsByUserId(userId: string) {
    try {
      const channels = await this.collection
        .find({ participants: userId })
        .project<{ id: string }>({ id: 1 })
        .toArray();

      const channelIds = channels.map((channel) => channel.id);

      return channelIds;
    } catch (_) {
      return [];
    }
  }

  async addParticipantToChannel(userId: string, channelId: string) {
    // TODO: { $addToSet: { participants: userId } }
  }

  async deleteParticipantFromChannel(userId: string, channelId: string) {
    // TODO: { $pull: { participants: userId } }
  }
}

export default ChannelModel;
