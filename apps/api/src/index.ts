import app from "./app.js";
import Message from "./entities/message.js";
import MessageModel from "./models/messageModel.js";
import Mongo from "./mongo.js";

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

// for (let i = 1; i < 11; i++) {
//   await MessageModel.sendToChannel(
//     "testchannel",
//     new Message("testsender", i.toString())
//   );
// }

const messages = await MessageModel.getMessages("testchannel", 1695346014515);
console.log(messages);
