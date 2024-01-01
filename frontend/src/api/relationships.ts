import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";
import type { UserProfile } from "./users";

export type Relationships = {
  friends: UserProfile[];
  pending: UserProfile[];
  blocked: UserProfile[];
};

export const getRelationships = wrapAxiosResult(() =>
  api.get<Relationships>("/api/relationships")
);

export const postFriendInviteByUsername = (username: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/send-friend-invite-by-username", {
      username,
    })
  )();

export const postFriendInviteById = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/send-friend-invite-by-id", { userId })
  )();

export const postAcceptFriendInvite = (senderId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/accept-friend-invite", { senderId })
  )();

export const postRejectFriendInvite = (senderId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/reject-friend-invite", { senderId })
  )();

export const postBlockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/block-user", { userId })
  )();

export const postUnblockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/unblock-user", { userId })
  )();
