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

const server = createServer(app);
const wss = new WebSocketServer({ server });

export const [wsServerClient, socketClientManager] = wsApp.register(wss, {
  // TODO: move to wsApp.ts
  onListening: () => {
    console.log(`WS server listening on ws://localhost:3000`);
  },
  onConnection: (client, req, userId) => {
    console.log(`Client ${client.id} connected`);
    userModel.setIsOnline(userId, true);
    // TODO: notify subscribers if isOnline was false
    // and profile status is not set to invisible
  },
  onClose: (client, userId) => {
    profileSubscriptionStore.deleteAllSubscriptions(client.id);
    console.log(`Client ${client.id} disconnected`);

    const connectedUserClients = socketClientManager._getClientsFromNamespace(
      `user_${userId}`
    );

    if (connectedUserClients.length === 0) {
      userModel.setIsOnline(userId, false);

      // TODO: notify subscribers that the user status is "offline"
    }
  },
});

server.listen(3000, () => {
  console.log(`HTTP server listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
