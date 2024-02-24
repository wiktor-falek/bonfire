import Mongo from "./db/mongo.js";
import Redis from "./db/redis.js";
import ChannelModel from "./models/channelModel.js";
import UserModel from "./models/userModel.js";
import FriendInviteModel from "./models/friendInviteModel.js";
import RelationModel from "./models/relationModel.js";
import AuthService from "./services/authService.js";
import MessageService from "./services/messageService.js";
import SessionStore from "./stores/sessionStore.js";
import UserService from "./services/userService.js";
import RelationshipService from "./services/relationshipService.js";
import NotificationService from "./services/notificationService.js";
import UserController from "./controllers/userController.js";
import AuthController from "./controllers/authController.js";
import ChannelController from "./controllers/channelController.js";
import MessageController from "./controllers/messageController.js";
import RelationshipController from "./controllers/relationshipController.js";
import StatusController from "./controllers/statusController.js";
import StatusService from "./services/statusService.js";

// Database connections
const [redisClient, mongoClient] = await Promise.all([
  new Redis("redis://localhost:6379").connectOrThrow(),
  new Mongo("mongodb://localhost:27017").connectOrThrow(),
]);

// Databases
export const mongoDb = mongoClient.db("bonfire");

// Stores
export const sessionStore = new SessionStore(redisClient);

// Models
export const userModel = new UserModel(mongoDb);
export const channelModel = new ChannelModel(mongoDb);
export const friendInviteModel = new FriendInviteModel(mongoDb);
export const relationModel = new RelationModel(mongoDb);

// Services
export const notificationService = new NotificationService();
export const authService = new AuthService(userModel, sessionStore);
export const messageService = new MessageService(channelModel);
export const userService = new UserService(userModel);
export const statusService = new StatusService(userModel);
export const relationshipService = new RelationshipService(
  userModel,
  friendInviteModel,
  relationModel,
  userService,
  notificationService
);

// Controllers
export const authController = new AuthController(authService);
export const userController = new UserController(userService);
export const channelController = new ChannelController(
  channelModel,
  userService
);
export const messageController = new MessageController(messageService);
export const relationshipController = new RelationshipController(
  relationshipService
);
export const statusController = new StatusController(statusService);
