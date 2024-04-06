import { z } from "zod";
import type { ProfileSubscriptionStore } from "../../stores/profileSubscription.js";
import type { ServerToClientEvents } from "../../../../websocket/types.js";
import type { WsClient } from "../../../../websocket/wsClient.js";
import type { userProfileIdsSchema } from "../../../users/index.js";

export class ProfileSubscriptionControllerWS {
  constructor(private profileSubscriptionStore: ProfileSubscriptionStore) {}

  subscribeToUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfileIdsSchema>,
    userId: string
  ) {
    const { profileIds } = data;
    const subscriptions = this.profileSubscriptionStore.addSubscriptions(
      client.id,
      profileIds
    );
  }

  unsubscribeFromUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfileIdsSchema>,
    userId: string
  ) {}
}
