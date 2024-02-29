import app from "./app.js";
import wsApp from "./wsApp.js";
import cron from "node-cron";
import createIndexes from "./db/helpers/createIndexes.js";
import { mongoDb, sessionStore } from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import config from "./config.js";

if (config.NODE_ENV === "development") {
  await createIndexes(mongoDb);
  console.log("Successfully created MongoDB indexes");
}

const server = createServer(app);
const wss = new WebSocketServer({ server });

export const [wsServerClient, socketClientManager] = wsApp.register(wss);

server.listen(3000, () => {
  console.log(`HTTP server listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
