import { Ok, Err } from "resultat";
import type { Collection, Db } from "mongodb";
import type User from "../entities/user.js";

class UserModel {
  private db: Db;
  private collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection("users");
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

  async emailExists(email: string) {
    const count = await this.collection.countDocuments(
      {
        "account.email": email,
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
      return Err("Failed to create a user");
    }
  }
}

export default UserModel;
