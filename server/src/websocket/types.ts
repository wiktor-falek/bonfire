import type { Message } from "../entities/message.js";
import type { UserStatus } from "../entities/user.js";

export type ServerToClientEvents = {
  error: { reason: string };
  clientId: string;
  "chat:message": Message;
  "subscription:user-profile:status": { profileId: string; status: UserStatus };
};
