import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";
import type { UserProfile } from "./users";

export type Relations = {
  friends: UserProfile[];
  pending: UserProfile[];
  blocked: UserProfile[];
};

export const getRelations = wrapAxiosResult(() =>
  api.get<Relations>("/api/relations")
);

export const postFriendInviteByUsername = (username: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/send-friend-invite-by-username", {
      username,
    })
  )();

export const postFriendInviteById = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/send-friend-invite-by-id", { userId })
  )();

export const postAcceptFriendInvite = (senderId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/accept-friend-invite", { senderId })
  )();

export const postRejectFriendInvite = (senderId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/reject-friend-invite", { senderId })
  )();

export const postBlockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/block-user", { userId })
  )();

export const postUnblockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relations/unblock-user", { userId })
  )();
