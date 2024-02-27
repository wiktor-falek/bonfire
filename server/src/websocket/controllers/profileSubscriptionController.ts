import { z } from "zod";
import type { ServerToClientEvents } from "../types.js";
import WsClient from "../wsClient.js";
import type { userProfilesSchema } from "../../validators/websocket/index.js";
import type ProfileSubscriptionService from "../../services/profileSubscriptionService.js";

class ProfileSubscriptionControllerWS {
  constructor(private profileSubscriptionService: ProfileSubscriptionService) {}

  subscribeToUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {
    const { profileIds } = data;
    this.profileSubscriptionService.subscribe(client.id, profileIds);
  }

  unsubscribeFromUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {}
}

export default ProfileSubscriptionControllerWS;
