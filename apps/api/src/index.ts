import app from "./app.js";
import cron from "node-cron";
import createIndexes from "./helpers/createIndexes.js";
import { sessionStore } from "./instances.js";

await createIndexes();

app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});

cron.schedule("0 0 * * *", () => {
  // sessionStore.deleteAllExpiredSessions();
});
