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
