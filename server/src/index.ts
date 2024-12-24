import app from "./app.js";
import wsApp from "./wsApp.js";
import cron from "node-cron";
import createIndexes from "./db/helpers/createIndexes.js";
import { mongoDb, sessionStore } from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import config from "./config.js";

console.log(`Running in ${config.NODE_ENV} mode`);

(await createIndexes(mongoDb)).unwrap();

const PORT = 3000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

export const { wsServerClient, socketClientManager } = wsApp.listen(wss);

server.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

cron.schedule("0 0 * * *", () => {
  sessionStore.deleteAllExpiredSessions();
});
