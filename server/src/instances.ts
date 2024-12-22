import config from "./config.js";
import { Mongo, Redis } from "./db/index.js";
import { VerificationControllerHttp } from "./domains/auth/controllers/http/verification.js";
import {
  AuthControllerHttp,
  AuthService,
  EmailVerificationService,
  SessionStore,
} from "./domains/auth/index.js";
import {
  ChannelControllerHttp,
  ChannelModel,
  ChatControllerWS,
  MessageControllerHttp,
  MessageService,
} from "./domains/channels/index.js";
import { EmailSender } from "./domains/emails/helpers/emailSender.js";
import { EmailService } from "./domains/emails/index.js";
import { NoOpEmailService } from "./domains/emails/services/email.no-op.js";
import {
  ProfileSubscriptionControllerWS,
  ProfileSubscriptionStore,
} from "./domains/notifications/index.js";
import { NotificationService } from "./domains/notifications/services/notifications.js";
import {
  FriendInviteModel,
  RelationControllerHttp,
  RelationModel,
  RelationService,
} from "./domains/relations/index.js";
import {
  ProfileControllerHttp,
  ProfileService,
  UserControllerHttp,
  UserModel,
  UserService,
} from "./domains/users/index.js";

// Database connections
const [redisClient, mongoClient] = await Promise.all([
  new Redis("redis://localhost:6379").connectOrThrow(),
  new Mongo("mongodb://127.0.0.1:27017").connectOrThrow(),
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
export const emailService =
  config.NODE_ENV === "production"
    ? new EmailService(new EmailSender(config.EMAIL_USER, config.EMAIL_PASS))
    : new NoOpEmailService();
export const emailVerificationService = new EmailVerificationService(
  userModel,
  emailService
);
export const authService = new AuthService(
  userModel,
  sessionStore,
  emailService
);
export const notificationService = new NotificationService(
  // wsServerClient,
  profileSubscriptionStore
);
export const messageService = new MessageService(channelModel);
export const userService = new UserService(userModel);
export const statusService = new ProfileService(userModel, notificationService);
export const relationService = new RelationService(
  userModel,
  friendInviteModel,
  relationModel,
  userService
);

// HTTP Controllers
export const authControllerHttp = new AuthControllerHttp(authService);
export const verificationControllerHttp = new VerificationControllerHttp(
  emailVerificationService
);
export const userControllerHttp = new UserControllerHttp(userService);
export const channelControllerHttp = new ChannelControllerHttp(
  channelModel,
  userService
);
export const messageControllerHttp = new MessageControllerHttp(messageService);
export const relationControllerHttp = new RelationControllerHttp(
  relationService
);
export const statusControllerHttp = new ProfileControllerHttp(statusService);

// WebSocket Controllers
export const chatControllerWS = new ChatControllerWS(messageService);
export const profileSubscriptionControllerWS =
  new ProfileSubscriptionControllerWS(profileSubscriptionStore);
