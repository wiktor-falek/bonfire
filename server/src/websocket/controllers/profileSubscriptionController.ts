import { z } from "zod";
import type { ServerToClientEvents } from "../types.js";
import WsClient from "../wsClient.js";
import type { userProfilesSchema } from "../../validators/websocket/index.js";

class ProfileSubscriptionControllerWS {
  constructor() {}

  async subscribeToUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {
    const { profileIds } = data;

    // store subscription in a map<userId, ...profileIds>
    // profileSubscriptionManager.subscribe(userId, profileIds);

    // later in StatusController
    // const { userId, profileId } = ...
    // statusService.setStatus(userId, "away")
    // profileUpdateNotifier.statusUpdate(profileId, "away")

    /* 
  profileUpdateNotifier(profileId: string, status: UserStatus) {
    profileSubscriptionManager.stuff
    // idk
  }

  */
    // fetch all the profiles

    // send the up to date profiles to the client
  }

  async unsubscribeFromUserProfiles(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof userProfilesSchema>,
    userId: string
  ) {
    const { profileIds } = data;
  }
}

export default ProfileSubscriptionControllerWS;
