import { channelModel, messageModel, userModel } from "../instances.js";

async function createIndexes() {
  try {
    await Promise.all([
      userModel.createIndexes(),
      messageModel.createIndexes(),
      channelModel.createIndexes(),
    ]);
    console.log("Successfully created indexes");
  } catch (err) {
    console.error("Failed to create indexes", err);
  }
}

export default createIndexes;
