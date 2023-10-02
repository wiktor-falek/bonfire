import ChannelModel from "./models/channelModel.js";
import UserModel from "./models/userModel.js";
import Mongo from "./mongo.js";
import AuthService from "./services/authService.js";
import MessageService from "./services/messageService.js";
import SessionService from "./services/sessionService.js";

// Db
export const mongo = new Mongo("mongodb://localhost:27017");
export const mongoClient = await mongo.connect().catch((err) => {
  throw err;
});
export const mongoDb = mongoClient.db("bonfire");

// Models
export const userModel = new UserModel(mongoDb);
export const channelModel = new ChannelModel(mongoDb);

// Services
export const authService = new AuthService(userModel);
export const sessionService = new SessionService(userModel);
export const messageService = new MessageService(channelModel);
