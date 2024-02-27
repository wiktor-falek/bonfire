import type UserModel from "../models/userModel.js";
import type { UserStatus } from "../entities/user.js";
import { Ok } from "resultat";

class StatusServiceHTTP {
  constructor(private userModel: UserModel) {}

  async setStatus(userId: string, status: UserStatus) {
    const result = await this.userModel.updateStatus(userId, status);

    if (!result.ok) {
      return result;
    }

    // TODO: notify listeners

    return Ok(status);
  }
}

export default StatusServiceHTTP;
