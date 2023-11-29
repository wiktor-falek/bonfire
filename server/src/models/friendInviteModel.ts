import { type FriendInvite } from "../entities/friendInvite.js";
import { Ok, Err } from "resultat";
import { type Collection, type Db } from "mongodb";

class FriendInviteModel {
  private db: Db;
  private collection: Collection<FriendInvite>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<FriendInvite>("friendInvites");
  }

  async findInviteById(inviteId: string) {
    try {
      const result = await this.collection.findOne({ _id: inviteId });
      if (result === null) {
        return Err("Invite does not exist");
      }
      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async inviteExists(inviteId: string) {
    try {
      const count = await this.collection.countDocuments(
        { _id: inviteId },
        { limit: 1 }
      );
      const exists = Boolean(count);

      return Ok(exists);
    } catch (_) {
      return Err("Network Error");
    }
  }

  /**
   * Creates a friend invite between sender and recipient,
   * if neither of users have already invited the other user
   */
  async createInvite(friendInvite: FriendInvite) {
    try {
      const existingInvite = await this.collection.findOne({
        $or: [
          {
            senderId: friendInvite.senderId,
            recipientId: friendInvite.recipientId,
          },
          {
            senderId: friendInvite.recipientId,
            recipientId: friendInvite.senderId,
          },
        ],
      });

      if (existingInvite !== null) {
        if (existingInvite.recipientId == friendInvite.recipientId) {
          return Err("Invite Already Sent" as const);
        }
        return Ok("Recipient Already Invited Sender" as const);
      }
    } catch (_) {
      return Err("Network Error" as const);
    }

    try {
      const writeResult = await this.collection.insertOne(friendInvite);
      if (!writeResult.acknowledged) {
        return Err("Failed to create friend invite" as const);
      }
    } catch (_) {
      return Err("Network error" as const);
    }

    return Ok("Created Invite" as const);
  }

  async deleteInviteById(inviteId: string) {
    try {
      const deleteResult = await this.collection.deleteOne({ _id: inviteId });
      if (!deleteResult.acknowledged) {
        return Err("Failed to delete");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }
}

export default FriendInviteModel;
