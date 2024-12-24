import type { Collection, Db, MongoError } from "mongodb";
import { Err, Ok } from "resultat";
import type {
  SelectableUserStatus,
  User,
  UserStatus,
} from "../interfaces/user.js";
import type { IUserModel } from "./user.interface.js";

export class UserModel implements IUserModel {
  private db: Db;
  private collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection<User>("users");
  }

  async createUser(user: User) {
    const emailIsInUseResult = await this.emailIsVerified(user.account.email);

    if (!emailIsInUseResult.ok) {
      return emailIsInUseResult;
    }

    const emailIsInUse = emailIsInUseResult.val;

    if (emailIsInUse) {
      return Err("Email is already in use");
    }

    try {
      const result = await this.collection.insertOne(user);

      if (!result.acknowledged) {
        return Err("Failed to create a user");
      }

      return Ok();
    } catch (_e) {
      const error = _e as MongoError;
      if (error.code) {
        return Err("Unique constraint failed");
      }
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

  /**
   * Returns true if any user uses that email and verified it.
   */
  async emailIsVerified(email: string) {
    try {
      const count = await this.collection.countDocuments(
        {
          "account.email": email,
          "account.hasVerifiedEmail": true,
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

  /**
   * Changes email of the user, if another user has not verified that email.
   */
  async changeEmail(username: string, email: string) {
    try {
      const result = await this.collection.updateOne(
        {
          "account.username": username,
        },
        {
          $set: { "account.email": email },
        }
      );

      return result.acknowledged ? Ok() : Err("Something went wrong" as const);
    } catch (_e) {
      const error = _e as MongoError;
      if (error.code === 11000) {
        return Err("Email is already in use" as const);
      }
      return Err("Network error" as const);
    }
  }

  /**
   * Sets `account.hasVerifiedEmail` to true if the user uses the provided email,
   * and no user has verified provided email.
   */
  async verifyEmail(username: string, email: string) {
    try {
      const result = await this.collection.updateOne(
        {
          "account.username": username,
          "account.email": email,
          "account.hasVerifiedEmail": false,
        },
        {
          $set: { "account.hasVerifiedEmail": true },
        }
      );

      if (!result.modifiedCount) {
        return Err("Already verified or invalid email");
      }

      return Ok();
    } catch (_e) {
      const error = _e as MongoError;
      if (error.code === 11000) {
        return Err("Email is already in use");
      }
      return Err("Network Error");
    }
  }

  async setDisplayName(userId: string, displayName: string) {
    try {
      const updateResult = await this.collection.updateOne(
        { id: userId },
        { $set: { "account.displayName": displayName } }
      );

      if (!updateResult.acknowledged) {
        return Err("Failed to update display name");
      }
      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }

  async getStatus(userId: string) {
    try {
      const result = await this.collection.findOne<{ status: UserStatus }>(
        {
          id: userId,
        },
        { projection: { _id: 0, status: 1 } }
      );

      if (result === null) {
        return Err("User does not exist" as const);
      }

      return Ok<UserStatus>(result.status);
    } catch (_) {
      return Err("Network Error" as const);
    }
  }

  async updateStatus(userId: string, status: SelectableUserStatus) {
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

  async setIsOnline(userId: string, isOnline: boolean) {
    try {
      const updateResult = await this.collection.updateOne(
        { id: userId },
        {
          $set: { isOnline },
        }
      );
      return Ok();
    } catch (_) {
      return Err("Network Error");
    }
  }

  async setAllIsOnline(isOnline: boolean) {
    try {
      const updateResult = await this.collection.updateMany(
        { isOnline: !isOnline },
        {
          $set: { isOnline },
        }
      );
      if (updateResult.matchedCount === updateResult.modifiedCount) return Ok();
      return Err("Failed to set isOnline of each user");
    } catch (_) {
      return Err("Network Error");
    }
  }
}
