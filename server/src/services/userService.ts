import { Err, Ok } from "resultat";
import type UserModel from "../models/userModel.js";

type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  imgSrc?: string;
};

class UserService {
  constructor(private userModel: UserModel) {}

  async getUserProfileInfo(userId: string) {
    const user = await this.userModel.findById(userId);

    if (user === null) {
      return Err("Failed to get user profile");
    }

    return Ok({
      id: user.id,
      username: user.account.username,
      displayName: user.account.displayName,
    } as UserProfile);
  }
}

export default UserService;
