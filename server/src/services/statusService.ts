import type UserModel from "../models/userModel.js";
import type { UserStatus } from "../entities/user.js";
import { Ok } from "resultat";
import type ProfileSubscriptionStore from "../stores/profileSubscriptionStore.js";

class StatusService {
  constructor(
    private userModel: UserModel,
    private profileSubscriptionStore: ProfileSubscriptionStore
  ) {}

  async setStatus(userId: string, status: UserStatus) {
    const result = await this.userModel.updateStatus(userId, status);

    if (!result.ok) {
      return result;
    }

    const subscribers = this.profileSubscriptionStore.getSubscribers(userId);

    for (const clientId of subscribers) {
      // question is how do I get access to client object
      // client.toClient(clientId).emit("subscription:user-profile:status", status);
    }

    return Ok(status);
  }
}

export default StatusService;
