import { Ok, Err, type Result } from "resultat";
import type { Collection, Db } from "mongodb";
import type { User, UserStatus } from "../entities/user.js";
import type { IUserModel } from "../interfaces/userModelInterface.js";

class UserModel implements IUserModel {
  private db: Db;
  private collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<User>("users");
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

  async findByUsername(username: string) {
    try {
      const result = await this.collection.findOne<User>({
        "account.username": username,
      });

      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await this.collection.findOne<User>({
        "account.email": email,
      });

      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findById(id: string) {
    try {
      const result = await this.collection.findOne<User>({
        id,
      });
      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async findAllByIds(ids: string[]) {
    try {
      const result = await this.collection
        .find<User>({
          id: { $in: ids },
        })
        .toArray();

      return Ok(result);
    } catch (_) {
      return Err("Network Error");
    }
  }

  async emailExists(email: string) {
    try {
      const count = await this.collection.countDocuments(
        {
          "account.email": email,
        },
        { limit: 1 }
      );

      return Ok(Boolean(count));
    } catch (_) {
      return Err("Network Error");
    }
  }

  async usernameExists(username: string) {
    try {
      const count = await this.collection.countDocuments(
        {
          "account.username": username,
        },
        { limit: 1 }
      );

      return Ok(Boolean(count));
    } catch (_) {
      return Err("Network Error");
    }
  }

  async updateStatus(userId: string, status: UserStatus) {
    try {
      const updateResult = await this.collection.updateOne(
        { id: userId },
        { $set: { status } }
      );

      if (!updateResult.acknowledged) {
        return Err("Failed to update status");
      }

      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }
}

export default UserModel;
