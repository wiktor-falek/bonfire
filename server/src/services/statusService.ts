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
    const subscriptions =
      this.profileSubscriptionStore.getSubscriptions(clientId);

    for (const subscriberClientId of subscribers) {
      console.log("sending subscription data to client", clientId);
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
