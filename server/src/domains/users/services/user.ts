import { Err, Ok } from "resultat";
import type { User, UserProfile, UserStatus } from "../interfaces/user.js";
import type { IUserModel } from "../models/user.interface.js";

export class UserService {
  constructor(private userModel: IUserModel) {}

  // TODO: naming is hard
  private userToProfile(user: User, flag = false): UserProfile {
    let status: UserStatus;
    if (user.status === "invisible" || (flag && !user.isOnline)) {
      status = "offline";
    } else {
      status = user.status;
    }

    return {
      id: user.id,
      username: user.account.username,
      displayName: user.account.displayName,
      status,
    };
  }

  // TODO: probably refactor duplicate functions into one private with the flag

  async getCurrentUserProfileById(userId: string) {
    const findUserResult = await this.userModel.findById(userId);

    if (!findUserResult.ok) {
      return findUserResult;
    }

    const user = findUserResult.val;

    if (user === null) {
      return Err("Failed to get user profile");
    }

    const profile = this.userToProfile(user, false);

    return Ok(profile);
  }

  async getUserProfileById(userId: string) {
    const findUserResult = await this.userModel.findById(userId);

    if (!findUserResult.ok) {
      return findUserResult;
    }

    const user = findUserResult.val;

    if (user === null) {
      return Err("Failed to get user profile");
    }

    const profile = this.userToProfile(user, true);

    return Ok(profile);
  }

  async getUserProfilesByIds(ids: string[]) {
    const result = await this.userModel.findAllByIds(ids);

    if (!result.ok) {
      return result;
    }

    const users = result.val;

    const profiles = users.map((user) => this.userToProfile(user, true));

    return Ok(profiles);
  }
}
