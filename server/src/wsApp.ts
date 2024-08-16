import WebSocketApp from "./websocket/index.js";
import {
  chatControllerWS,
  profileSubscriptionControllerWS,
} from "./instances.js";
import { userProfileIdsSchema } from "./domains/users/index.js";
import { directMessageSchema } from "./domains/channels/index.js";

const wsApp = new WebSocketApp()
  .register(
    "chat:direct-message",
    chatControllerWS.directMessage.bind(chatControllerWS),
    directMessageSchema
  )
  .register(
    "subscribe:user-profiles",
    profileSubscriptionControllerWS.subscribeToUserProfiles.bind(
      profileSubscriptionControllerWS
    ),
    userProfileIdsSchema
  )
  .register(
    "unsubscribe:user-profiles",
    profileSubscriptionControllerWS.unsubscribeFromUserProfiles.bind(
      profileSubscriptionControllerWS
    ),
    userProfileIdsSchema
  );

export default wsApp;
