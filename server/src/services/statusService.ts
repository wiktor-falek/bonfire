import type UserModel from "../models/userModel.js";
import type { UserStatus } from "../entities/user.js";
import { Ok } from "resultat";
import type ProfileSubscriptionStore from "../stores/profileSubscriptionStore.js";
import { wsServerClient } from "../index.js";

class StatusService {
  constructor(
    private userModel: UserModel,
    private profileSubscriptionStore: ProfileSubscriptionStore
  ) {}

  async setStatus(userId: string, clientId: string, status: UserStatus) {
    const result = await this.userModel.updateStatus(userId, status);

    if (!result.ok) {
      return result;
    }

    const subscribers = this.profileSubscriptionStore.getSubscribers(userId);

    const length = subscribers.length;
    for (let i = 0; i < length; i++) {
      const subscriberClientId = subscribers[i]!;
      wsServerClient
        .toClient(subscriberClientId)
        .send("subscription:user-profile:status", {
          profileId: userId,
          status,
        });
    }

    return Ok(status);
  }
}

export default StatusService;
