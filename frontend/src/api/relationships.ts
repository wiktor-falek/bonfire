import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";
import type { UserProfile } from "./users/getCurrentProfile";

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
    api.post<{}>("/api/relationships/send-friend-request-by-username", {
      username,
    })
  )();
