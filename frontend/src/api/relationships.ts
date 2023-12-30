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
  );

export const postAccentFriendInvite = (inviteId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/accept-friend-invite", { inviteId })
  );

export const postRejectFriendInvite = (inviteId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/reject-friend-invite", { inviteId })
  );

export const postBlockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/block-user", { userId })
  );

export const postUnblockUser = (userId: string) =>
  wrapAxiosResult(() =>
    api.post<{}>("/api/relationships/unblock-user", { userId })
  );
