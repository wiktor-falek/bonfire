import { Err, Ok } from "resultat";
import type UserModel from "../models/userModel.js";
import type { User, UserStatus } from "../entities/user.js";

type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  imgSrc?: string;
};

class UserService {
  constructor(private userModel: UserModel) {}

  private userToProfile(user: User): UserProfile {
    return {
      id: user.id,
      username: user.account.username,
      displayName: user.account.displayName,
      status: user.status,
    };
  }

  async getUserProfileInfo(userId: string) {
    const findUserResult = await this.userModel.findById(userId);

    if (!findUserResult.ok) {
      return findUserResult;
    }

    const user = findUserResult.val;

    if (user === null) {
      return Err("Failed to get user profile");
    }

    const profile = this.userToProfile(user);

    return Ok(profile);
  }

  async getUserProfilesByIds(ids: string[]) {
    const result = await this.userModel.findAllByIds(ids);

    if (!result.ok) {
      return result;
    }

    const users = result.val;

    const profiles = users.map((user) => this.userToProfile(user));

    return Ok(profiles);
  }
}

export default UserService;
