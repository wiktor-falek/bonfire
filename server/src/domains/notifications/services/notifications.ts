import { wsServerClient } from "../../../index.js";
import type { ServerToClientEvents } from "../../../websocket/types.js";
import type { WsServerClient } from "../../../websocket/wsClient.js";
import type { UserStatus } from "../../users/index.js";
import type { ProfileSubscriptionStore } from "../index.js";

export class NotificationService {
  constructor(
    // private wsServerClient: WsServerClient<ServerToClientEvents>,
    private profileSubscriptionStore: ProfileSubscriptionStore
  ) {}

  notifyUserProfileStatusChange(userId: string, status: UserStatus) {
    const subscribers = this.profileSubscriptionStore.getSubscribers(userId);

    const length = subscribers.length;
    for (let i = 0; i < length; i++) {
      const subscriberClientId = subscribers[i]!;
      wsServerClient
        .toClient(subscriberClientId)
        .send("subscription:user-profile:status", {
          profileId: userId,
          status: "offline",
        });
    }
  }
}
