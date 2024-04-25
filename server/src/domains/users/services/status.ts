import type { SelectableUserStatus, UserStatus } from "../interfaces/user.js";
import { Ok } from "resultat";
import { wsServerClient } from "../../../index.js";
import type { ProfileSubscriptionStore } from "../../notifications/index.js";
import type { IUserModel } from "../models/user.interface.js";

export class StatusService {
  constructor(
    private userModel: IUserModel,
    private profileSubscriptionStore: ProfileSubscriptionStore
  ) {}

  async setStatus(userId: string, status: SelectableUserStatus) {
    // Check if status changed to prevent unnecessary notifications.
    // This would be especially bad if user was invisible and went offline.
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

    // TODO: move this logic to a service once implemented
    const subscribers = this.profileSubscriptionStore.getSubscribers(userId);

    const length = subscribers.length;
    for (let i = 0; i < length; i++) {
      const subscriberClientId = subscribers[i]!;
      wsServerClient
        .toClient(subscriberClientId)
        .send("subscription:user-profile:status", {
          profileId: userId,
          status: status === "invisible" ? "offline" : status,
        });
    }

    return Ok<UserStatus>(status === "invisible" ? "offline" : status);
  }
}
