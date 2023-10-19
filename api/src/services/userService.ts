import { Err, Ok } from "resultat";
import type UserModel from "../models/userModel.js";

class UserService {
  constructor(private userModel: UserModel) {}

  async getUserProfileInfo(userId: string) {
    const user = await this.userModel.findById(userId);
    if (user === null) return Err("Failed to get user profile");

    return Ok({
      displayName: user.account.displayName,
      username: user.account.username,
      imgSrc: "",
    });
  }
}

export default UserService;
