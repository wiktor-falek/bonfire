import { Ok, Err } from "resultat";
import type { Collection, Db } from "mongodb";
import type { User } from "../entities/user.js";
import type { IUserModel } from "../interfaces/userModelInterface.js";

class UserModel implements IUserModel {
  private db: Db;
  private collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<User>("users");
  }

  // TODO: try catch every query

  async findByUsername(username: string) {
    return this.collection.findOne<User>({
      "account.username": username,
    });
  }

  async findByEmail(email: string) {
    return this.collection.findOne<User>({
      "account.email": email,
    });
  }

  async findById(id: string) {
    return this.collection.findOne<User>({
      id,
    });
  }

  async findAllByIds(ids: string[]) {
    try {
      const result = await this.collection.find<User>({
        id: { $in: ids }
      }).toArray()

      return Ok(result);
    }
    catch (_) {
      return Err("Network Error");
    }
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

      return Ok();
    } catch (_) {
      return Err("Failed to create a user");
    }
  }
}

export default UserModel;
