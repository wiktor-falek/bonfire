import config from "./config.js";
import { Mongo, Redis } from "./db/index.js";
import {
  AuthControllerHTTP,
  AuthService,
  SessionStore,
} from "./domains/auth/index.js";
import {
  ChannelControllerHTTP,
  ChannelModel,
  ChatControllerWS,
  MessageControllerHTTP,
  MessageService,
} from "./domains/channels/index.js";
import { EmailSender } from "./domains/emails/helpers/emailSender.js";
import { EmailService } from "./domains/emails/index.js";
import {
  ProfileSubscriptionControllerWS,
  ProfileSubscriptionStore,
} from "./domains/notifications/index.js";
import {
  FriendInviteModel,
  RelationControllerHTTP,
  RelationModel,
  RelationService,
} from "./domains/relations/index.js";
import {
  StatusControllerHTTP,
  StatusService,
  UserControllerHTTP,
  UserModel,
  UserService,
} from "./domains/users/index.js";

// Database connections
const [redisClient, mongoClient] = await Promise.all([
  new Redis("redis://localhost:6379").connectOrThrow(),
  new Mongo("mongodb://localhost:27017").connectOrThrow(),
]);

// Databases
export const mongoDb = mongoClient.db("bonfire");

// Stores
export const sessionStore = new SessionStore(redisClient);
export const profileSubscriptionStore = new ProfileSubscriptionStore();

// Models
export const userModel = new UserModel(mongoDb);
export const channelModel = new ChannelModel(mongoDb);
export const friendInviteModel = new FriendInviteModel(mongoDb);
export const relationModel = new RelationModel(mongoDb);

// Services
export const emailService = new EmailService(
  new EmailSender(config.EMAIL_USER, config.EMAIL_PASS)
);
export const authService = new AuthService(userModel, sessionStore);
export const messageService = new MessageService(channelModel);
export const userService = new UserService(userModel);
export const statusService = new StatusService(
  userModel,
  profileSubscriptionStore
);
export const relationService = new RelationService(
  userModel,
  friendInviteModel,
  relationModel,
  userService
);

// HTTP Controllers
export const authControllerHTTP = new AuthControllerHTTP(authService);
export const userControllerHTTP = new UserControllerHTTP(userService);
export const channelControllerHTTP = new ChannelControllerHTTP(
  channelModel,
  userService
);
export const messageControllerHTTP = new MessageControllerHTTP(messageService);
export const relationControllerHTTP = new RelationControllerHTTP(
  relationService
);
export const statusControllerHTTP = new StatusControllerHTTP(statusService);

// WS Controllers
export const chatControllerWS = new ChatControllerWS(messageService);
export const profileSubscriptionControllerWS =
  new ProfileSubscriptionControllerWS(profileSubscriptionStore);
