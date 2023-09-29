import type { Collection, Db, MongoError } from "mongodb";
import { Ok, Err } from "resultat";

type Channel = {
  id: string;
  participants: string[];
  name?: string;
};

class ChannelModel {
  private db: Db;
  private collection: Collection<Channel>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection("channels");
  }

  createIndexes() {
    return this.collection.createIndexes([
      {
        key: { id: 1 },
        unique: true,
      },
    ]);
  }

  async createChannel(id: string, name?: string) {
    const channel: Channel = {
      id,
      name,
      participants: [],
    };

    try {
      await this.collection.insertOne(channel);
      return Ok(id);
    } catch (_e) {
      const error = _e as MongoError;
      console.error("UNHANDLED ERROR: createChannel", error);
      return Err(`Failed to create the channel with id=${id}`);
    }
  }

  async findChannelById(id: string) {
    const channel = await this.collection.findOne<Channel>(
      { id: id },
      { projection: { _id: 0 } }
    );

    if (channel === null) {
      return Err(`Channel with id=${id} does not exist`);
    }

    return Ok(channel);
  }

  async findChannelsByUserId(userId: string) {
    // TODO: find all channels where participants.includes(userId)
  }

  async addParticipantToChannel(userId: string, channelId: string) {
    // TODO: { $addToSet: { participants: userId } }
  }

  async removeParticipantFromChannel(userId: string, channelId: string) {
    // TODO: { $pull: { participants: userId } }
  }
}

export default ChannelModel;
