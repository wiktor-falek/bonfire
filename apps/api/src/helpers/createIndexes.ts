import { channelModel, messageModel, userModel } from "../instances.js";

function createIndexes() {
  return Promise.all([
    userModel.createIndexes(),
    messageModel.createIndexes(),
    channelModel.createIndexes(),
  ])
    .then(() => {
      console.log("Successfully created indexes");
    })
    .catch((err) => {
      console.error("Failed to create indexes", err);
    });
}

export default createIndexes;
