import { type Collection, type Db } from "mongodb";
import { Err, Ok } from "resultat";
import { type FriendInvite } from "../interfaces/invite.js";

export class FriendInviteModel {
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

  async findInviteBySenderAndRecipient(senderId: string, recipientId: string) {
    try {
      const result = await this.collection.findOne({ senderId, recipientId });

      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findAllInvitesSentByUser(userId: string) {
    try {
      const result = await this.collection
        .find<FriendInvite>({ senderId: userId })
        .toArray();

      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findAllInvitesSentToUser(userId: string) {
    try {
      const result = await this.collection
        .find<FriendInvite>({ recipientId: userId })
        .toArray();

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
      if (deleteResult.deletedCount === 0) {
        return Err("Invite not found");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }

  async deleteInviteBySenderAndRecipient(
    senderId: string,
    recipientId: string
  ) {
    try {
      const deleteResult = await this.collection.deleteOne({
        $or: [
          {
            senderId: senderId,
            recipientId: recipientId,
          },
          {
            senderId: recipientId,
            recipientId: senderId,
          },
        ],
      });
      if (deleteResult.deletedCount === 0) {
        return Err("Invite not found");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }
}
