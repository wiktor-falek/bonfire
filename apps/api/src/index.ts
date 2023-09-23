import app from "./app.js";
import Mongo from "./mongo.js";
import cron from "node-cron";

await Mongo.connect()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((reason) => {
    console.log("Database connection failed. Reason:", reason);
  });

const server = app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived signal: ${signal}`);
  console.log("Shutting down gracefully...");
  server.close();
  await Mongo.close();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

cron.schedule("0 0 * * *", () => {
  // SessionService.deleteExpiredSessions()
})