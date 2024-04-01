import WebSocketApp from "./websocket/index.js";
import {
  chatControllerWS,
  profileSubscriptionControllerWS,
} from "./instances.js";
import { userProfileIdsSchema } from "./domains/users/index.js";
import { directMessageSchema } from "./domains/channels/index.js";

const wsApp = new WebSocketApp()
  .bind(
    "chat:direct-message",
    chatControllerWS.directMessage.bind(chatControllerWS),
    directMessageSchema
  )
  .bind(
    "subscribe:user-profiles",
    profileSubscriptionControllerWS.subscribeToUserProfiles.bind(
      profileSubscriptionControllerWS
    ),
    userProfileIdsSchema
  )
  .bind(
    "unsubscribe:user-profiles",
    profileSubscriptionControllerWS.unsubscribeFromUserProfiles.bind(
      profileSubscriptionControllerWS
    ),
    userProfileIdsSchema
  );

export default wsApp;
