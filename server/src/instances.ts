import ChannelModel from "./models/channelModel.js";
import UserModel from "./models/userModel.js";
import Mongo from "./db/mongo.js";
import Redis from "./db/redis.js";
import AuthService from "./services/authService.js";
import MessageService from "./services/messageService.js";
import SessionStore from "./stores/sessionStore.js";
import UserService from "./services/userService.js";
import FriendInviteModel from "./models/friendInviteModel.js";
import FriendRelationModel from "./models/friendRelationModel.js";
import RelationshipService from "./services/relationshipService.js";

// Db
export const [redisClient, mongoClient] = await Promise.all([
  new Redis().connect(),
  new Mongo("mongodb://localhost:27017").connect(),
]);
export const mongoDb = mongoClient.db("bonfire");

// Stores
export const sessionStore = new SessionStore(redisClient);

// Models
export const userModel = new UserModel(mongoDb);
export const channelModel = new ChannelModel(mongoDb);
export const friendInviteModel = new FriendInviteModel(mongoDb);
export const friendRelationModel = new FriendRelationModel(mongoDb);

// Services
export const authService = new AuthService(userModel, sessionStore);
export const messageService = new MessageService(channelModel);
export const userService = new UserService(userModel);
export const relationshipService = new RelationshipService(
  friendInviteModel,
  friendRelationModel
);
