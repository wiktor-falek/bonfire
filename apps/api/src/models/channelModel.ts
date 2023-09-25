import { Ok, Err } from "resultat";
import { z } from "zod";
import type { Collection, Db, Document, WithoutId } from "mongodb";

const channelSchema = z.object({
  id: z.string().length(21),
  name: z.string().optional(),
  participants: z.array(z.string().length(21)).default([]),
});

export type ChannelType = z.infer<typeof channelSchema>;

class ChannelModel {
  db: Db;
  collection: Collection<Document>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection("channels");
  }

  createIndexes() {
    return this.collection.createIndexes([
      {
        key: { id: 1 },
        unique: true,
      },
    ]);
  }

  async createChannel(id: string) {
    const validation = channelSchema.safeParse({
      id,
    });

    if (!validation.success) {
      return Err(validation.error.errors);
    }

    const channel = validation.data;

    const result = await this.collection.insertOne(
      { channel },
      { forceServerObjectId: false }
    );

    return !result.acknowledged
      ? Err(`Failed to create the channel with id=${id}`)
      : Ok(id);
  }

  async findChannelById(id: string) {
    const channel = await this.collection.findOne<WithoutId<ChannelType>>(
      { id: id },
      { projection: { _id: 0 } }
    );

    return channel === null
      ? Err(`Channel with id=${id} does not exist`)
      : Ok(channel);
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
