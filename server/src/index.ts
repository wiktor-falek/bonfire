import app from "./app.js";
import cron from "node-cron";
import createIndexes from "./helpers/createIndexes.js";
import { mongoDb, sessionStore } from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import registerWebSocketServer from "./websocket/index.js";
import config from "./config.js";

if (config.NODE_ENV === "development") {
  await createIndexes(mongoDb);
  console.log("Successfully created indexes");
}

const server = createServer(app);
const wss = new WebSocketServer({ server });

registerWebSocketServer(wss);

server.listen(3000, () => {
  console.log(`HTTP server Listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
