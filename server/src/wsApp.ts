import WebSocketApp from "./websocket/index.js";
import {
  chatControllerWS,
  notificationService,
  profileSubscriptionControllerWS,
  profileSubscriptionStore,
  userModel,
} from "./instances.js";
import { userProfileIdsSchema } from "./domains/users/index.js";
import { directMessageSchema } from "./domains/channels/index.js";
import { socketClientManager } from "./index.js";

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
  )
  .onListening(() => {
    console.log("WebSocket server is listening");
  })
  .onConnection((client, req, userId) => {
    console.log(`User ${userId} Client ${client.id} connected`);

    // Subscribe the client to a personal namespace of the user.
    // This enables sending events to all connected devices of that user,
    // by using client.to(`user_${userId}`).send(...)
    client.subscribe(`user_${userId}`);

    userModel.setIsOnline(userId, true);

    const devicesConnected = socketClientManager.getClientsFromNamespace(
      `user_${userId}`
    ).length;

    console.log(`Connected devices of user ${userId}: ${devicesConnected}`);

    if (devicesConnected === 1) {
      userModel.getStatus(userId).then((result) => {
        if (!result.ok) return;
        const status = result.val;

        // Avoid emitting if appearing offline for user privacy
        if (status === "offline") return;

        notificationService.notifyUserProfileStatusChange(userId, status);
      });
    }
  })
  .onClose((client, userId) => {
    console.log(`User ${userId} Client ${client.id} disconnected`);

    profileSubscriptionStore.deleteAllSubscriptions(client.id);

    const devicesConnected = socketClientManager.getClientsFromNamespace(
      `user_${userId}`
    ).length;

    console.log(`Connected devices of user ${userId}: ${devicesConnected}`);

    if (devicesConnected === 0) {
      userModel.setIsOnline(userId, false);
      notificationService.notifyUserProfileStatusChange(userId, "offline");
    }
  });

export default wsApp;
