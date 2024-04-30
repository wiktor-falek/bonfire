import app from "./app.js";
import wsApp from "./wsApp.js";
import cron from "node-cron";
import createIndexes from "./db/helpers/createIndexes.js";
import {
  mongoDb,
  notificationService,
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
    console.log(`User ${userId} Client ${client.id} connected`);

    userModel.setIsOnline(userId, true);

    const devicesConnected = socketClientManager._getClientsFromNamespace(
      `user_${userId}`
    ).length;

    if (devicesConnected === 1) {
      userModel.getStatus(userId).then((result) => {
        if (!result.ok) return;
        const status = result.val;

        // Avoid emitting if appearing offline for user privacy
        if (status === "offline") return;

        notificationService.notifyUserProfileStatusChange(userId, status);
      });
    }
  },
  onClose: (client, userId) => {
    console.log(`User ${userId} Client ${client.id} disconnected`);

    profileSubscriptionStore.deleteAllSubscriptions(client.id);

    const devicesConnected = socketClientManager._getClientsFromNamespace(
      `user_${userId}`
    ).length;

    if (devicesConnected === 0) {
      userModel.setIsOnline(userId, false);
      notificationService.notifyUserProfileStatusChange(userId, "offline");
    }
  },
});

server.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
