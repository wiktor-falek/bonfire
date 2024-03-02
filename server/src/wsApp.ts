import WebSocketApp from "./websocket/index.js";
import {
  directMessageSchema,
  userProfilesSchema,
} from "./validators/websocket/index.js";
import {
  chatControllerWS,
  profileSubscriptionControllerWS,
} from "./instances.js";

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
    userProfilesSchema
  )
  .bind(
    "unsubscribe:user-profiles",
    profileSubscriptionControllerWS.unsubscribeFromUserProfiles.bind(
      profileSubscriptionControllerWS
    ),
    userProfilesSchema
  );

export default wsApp;
