import { Ok, Err, type ResultErr, type ResultOk } from "resultat";
import type { Collection, Db, Document } from "mongodb";
import User from "../entities/user.js";

class UserModel {
  private db: Db;
  private collection: Collection<Document>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection("users");
  }

  createIndexes() {
    return this.collection.createIndexes([
      {
        key: { id: 1 },
        unique: true,
      },
    ]);
  }

  async findByUsername(username: string) {
    const user = await this.collection.findOne<User>({
      "account.username": username,
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.collection.findOne<User>({
      "account.email": email,
    });

    return user;
  }

  async findBySessionId(sessionId: string) {
    // TODO: support more than one sessionId
    const user = await this.collection.findOne<User>({
      "account.sessionId": sessionId,
    });

    return user;
  }

  async emailExists(email: string) {
    const count = await this.collection.countDocuments(
      {
        "account.email": email,
      },
      { limit: 1 }
    );

    return Boolean(count);
  }

  async sessionExists(sessionId: string) {
    const count = await this.collection.countDocuments(
      {
        "account.sessionId": sessionId,
      },
      { limit: 1 }
    );

    return Boolean(count);
  }

  async createUser(user: User) {
    try {
      const result = await this.collection.insertOne(user);

      if (!result.acknowledged) {
        return Err("Failed to create a user");
      }

      return Ok(1);
    } catch (error) {
      console.error("Failed to create a user", error);
      return Err("Failed to create a user");
    }
  }

  async updateSession(sessionId: string, email: string) {
    const result = await this.collection.updateOne(
      { "account.email": email },
      { $set: { "account.sessionId": sessionId } }
    );

    if (!result.acknowledged) {
      return Err("Failed to create a user");
    }

    return Ok(1);
  }
}

export default UserModel;
