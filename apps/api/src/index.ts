import app from "./app.js";
import cron from "node-cron";
import createIndexes from "./helpers/createIndexes.js";
import { sessionService } from "./instances.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";

await createIndexes()
  .then(() => {
    console.log("Successfully created indexes");
  })
  .catch((err) => {
    throw new Error(err);
  });

const server = createServer(app);
export const wss = new WebSocketServer({ server });

server.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  sessionService.clearExpiredSessions();
});
