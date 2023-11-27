import { Ok, Err } from "resultat";
import { type Collection, type Db } from "mongodb";
import type { FriendRelation } from "src/entities/friendRelation.js";

class FriendRelationModel {
  private db: Db;
  private collection: Collection<FriendRelation>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<FriendRelation>("friendInvites");
  }

  async createRelation(friendRelation: FriendRelation) {
    try {
      const writeResult = await this.collection.insertOne(friendRelation);
      if (!writeResult.acknowledged) {
        return Err("Failed to create relation");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }

  findRelationById(relationId: string) {}

  async relationExists(relationId: string) {
    try {
      const count = await this.collection.countDocuments(
        { _id: relationId },
        { limit: 1 }
      );
      const exists = Boolean(count);

      return Ok(exists);
    } catch (_) {
      return Err("Network Error");
    }
  }
}

export default FriendRelationModel;
