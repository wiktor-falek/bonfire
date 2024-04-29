import app from "./app.js";
import wsApp from "./wsApp.js";
import cron from "node-cron";
import createIndexes from "./db/helpers/createIndexes.js";
import {
  mongoDb,
  profileSubscriptionStore,
  sessionStore,
  userModel,
} from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";

(await createIndexes(mongoDb)).unwrap();
console.log("Created MongoDB indexes");

const PORT = 3000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

export const [wsServerClient, socketClientManager] = wsApp.listen(wss, {
  // TODO: move to wsApp.ts
  onListening: () => {
    console.log(`WS server listening on ws://localhost:${PORT}`);
  },
  onConnection: (client, req, userId) => {
    console.log(`Client ${client.id} connected`);
    userModel.setIsOnline(userId, true);

    userModel.getStatus(userId).then((result) => {
      if (!result.ok) return;
      const status = result.val;

      // Avoid emitting if appearing offline for
      if (status === "offline") return;

      // TODO: move to a notifcation service
      const subscribers = profileSubscriptionStore.getSubscribers(userId);

      const length = subscribers.length;
      for (let i = 0; i < length; i++) {
        const subscriberClientId = subscribers[i]!;
        wsServerClient
          .toClient(subscriberClientId)
          .send("subscription:user-profile:status", {
            profileId: userId,
            status,
          });
      }
    });
  },
  onClose: (client, userId) => {
    profileSubscriptionStore.deleteAllSubscriptions(client.id);
    console.log(`Client ${client.id} disconnected`);

    const connectedUserClients = socketClientManager._getClientsFromNamespace(
      `user_${userId}`
    );

    if (connectedUserClients.length === 0) {
      userModel.setIsOnline(userId, false);

      // TODO: move to a notifcation service
      const subscribers = profileSubscriptionStore.getSubscribers(userId);

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
  },
});

server.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
