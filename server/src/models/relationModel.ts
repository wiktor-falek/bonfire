import { Ok, Err } from "resultat";
import { type Collection, type Db } from "mongodb";
import type {
  BlockRelation,
  FriendRelation,
  Relation,
} from "../entities/relations.js";

class RelationModel {
  private db: Db;
  private collection: Collection<Relation>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<Relation>("relations");
  }

  async createRelation(relation: Relation) {
    try {
      const writeResult = await this.collection.insertOne(relation);

      if (!writeResult.acknowledged) {
        return Err("Failed to create relation");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findRelationById(relationId: string) {
    try {
      const relation = await this.collection.findOne({ _id: relationId });
      if (relation === null) {
        return Err("Relationship does not exist");
      }

      return Ok(relation);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findAllUserFriendRelations(userId: string) {
    try {
      const relations = await this.collection
        .find<FriendRelation>({
          kind: "friend",
          $or: [{ firstUserId: userId }, { secondUserId: userId }],
        })
        .toArray();

      return Ok(relations);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findAllUserBlockRelations(userId: string) {
    try {
      const relations = await this.collection
        .find<BlockRelation>({ kind: "block", firstUserId: userId })
        .toArray();

      return Ok(relations);
    } catch (_) {
      return Err("Network Error");
    }
  }

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

  async findRelationBetweenUsers(firstUserId: string, secondUserId: string) {
    try {
      const relation = await this.collection.findOne({
        $or: [
          { firstUserId, secondUserId },
          { firstUserId: secondUserId, secondUserId: firstUserId },
        ],
      });

      return Ok(relation);
    } catch (_) {
      return Err("Network Error" as const);
    }
  }

  async findFriendRelationByUserIds(firstUserId: string, secondUserId: string) {
    try {
      const friendRelation = await this.collection.findOne<FriendRelation>({
        kind: "friend",
        $or: [
          { firstUserId, secondUserId },
          { firstUserId: secondUserId, secondUserId: firstUserId },
        ],
      });

      if (friendRelation === null) {
        return Err("Relation does not exist" as const);
      }

      return Ok(friendRelation);
    } catch (_) {
      return Err("Network error" as const);
    }
  }
}

export default RelationModel;
