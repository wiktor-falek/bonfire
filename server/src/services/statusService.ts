import type { UserModel } from "../domains/users/index.js";
import type { UserStatus } from "../entities/user.js";
import { Ok } from "resultat";
import type ProfileSubscriptionStore from "../stores/profileSubscriptionStore.js";
import { wsServerClient } from "../index.js";

class StatusService {
  constructor(
    private userModel: UserModel,
    private profileSubscriptionStore: ProfileSubscriptionStore
  ) {}

  async setStatus(userId: string, status: UserStatus) {
    // Check if status changed to prevent unnecessary notifications.
    // This would be especially bad if user was invisible and went offline
    const getStatusResult = await this.userModel.getStatus(userId);

    if (!getStatusResult.ok) {
      return getStatusResult;
    }

    const currentStatus = getStatusResult.val;

    if (currentStatus === status) {
      return Ok(currentStatus);
    }

    const updateStatusResult = await this.userModel.updateStatus(
      userId,
      status
    );

    if (!updateStatusResult.ok) {
      return updateStatusResult;
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
