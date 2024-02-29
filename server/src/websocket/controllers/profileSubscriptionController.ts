import { z } from "zod";
import type { ServerToClientEvents } from "../types.js";
import type { WsClient } from "../wsClient.js";
import type { userProfilesSchema } from "../../validators/websocket/index.js";
import type ProfileSubscriptionStore from "../../stores/profileSubscriptionStore.js";

class ProfileSubscriptionControllerWS {
  constructor(private profileSubscriptionStore: ProfileSubscriptionStore) {}

  subscribeToUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {
    const { profileIds } = data;
    const subscriptions = this.profileSubscriptionStore.addSubscriptions(
      client.id,
      profileIds
    );
    console.log("updated subscriptions", subscriptions);
  }

  unsubscribeFromUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {}
}

export default ProfileSubscriptionControllerWS;
