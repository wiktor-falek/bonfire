import Mongo from "../mongo.js";
import { Ok, Err } from "resultat";
import { z } from "zod";
import type { WithoutId } from "mongodb";

const channelSchema = z.object({
  id: z.string().length(18),
  name: z.string().optional(),
  participants: z.array(z.string().length(18)).default([]),
});

export type ChannelType = z.infer<typeof channelSchema>;

class ChannelModel {
  private static db = Mongo.getClient().db("bonfire");
  private static collection = this.db.collection("channels");

  static createIndexes() {
    return this.collection.createIndexes([
      {
        key: { id: 1 },
        unique: true,
      },
    ]);
  }

  static async createChannel(id: string) {
    const validation = channelSchema.safeParse({
      id,
    });

    if (!validation.success) {
      return Err(validation.error.errors.toString()); // TODO: bump resultat to 1.0.7
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

  static async findChannelById(id: string) {
    const channel = await this.collection.findOne<WithoutId<ChannelType>>(
      { id: id },
      { projection: { _id: 0 } }
    );

    return channel === null
      ? Err(`Channel with id=${id} does not exist`)
      : Ok(channel);
  }

  static async findChannelsByUserId(userId: string) {
    // TODO: find all channels where participants.includes(userId)
  }

  static async addParticipantToChannel(userId: string, channelId: string) {
    // TODO: { $addToSet: { participants: userId } }
  }

  static async removeParticipantFromChannel(userId: string, channelId: string) {
    // TODO: { $pull: { participants: userId } }
  }
}

ChannelModel.createIndexes();

export default ChannelModel;
