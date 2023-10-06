import app from "./app.js";
import cron from "node-cron";
import createIndexes from "./helpers/createIndexes.js";
import { sessionStore } from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { setupWebSocketServer } from "./websocket.js";

await createIndexes()
  .then(() => {
    console.log("Successfully created indexes");
  })
  .catch((err) => {
    throw new Error(err);
  });

const server = createServer(app);
export const wss = new WebSocketServer({ server });

setupWebSocketServer(); // necessary before starting to listen

server.listen(3000, () => {
  console.log(`HTTP server Listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  // sessionStore.deleteAllExpiredSessions();
});
