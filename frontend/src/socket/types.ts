import type { UserStatus, UserProfile } from "../api/users";

export type ServerToClientEvents = {
  error: { reason: string };
  clientId: string;
  "chat:message": {
    senderId: string;
    content: string;
    timestamp: number;
  };
  userProfiles: UserProfile[];
  "subscription:user-profile:status": { profileId: string; status: UserStatus };
  "subscription:user-profile:displayName": {
    profileId: string;
    displayName: string;
  };
  "relation:friend-invite": { profile: UserProfile };
};

export type ClientToServerEvents = {
  "chat:direct-message": {
    recipientId: string;
    content: string;
  };
  "subscribe:user-profiles": { profileIds: string[] };
  "unsubscribe:user-profiles": { profileIds: string[] };
};
