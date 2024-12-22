import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";

export type UserStatus = "online" | "away" | "dnd" | "offline";

export type SelectableUserStatus = Exclude<UserStatus, "offline"> | "invisible";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  imgSrc?: string;
};

export const getCurrentProfile = wrapAxiosResult(() =>
  api.get<UserProfile>("/api/users/profile/me")
);

export const getUserProfileById = (userId: string) =>
  wrapAxiosResult(() => api.get<UserProfile>(`/api/users/profile/${userId}`))();

export const getUserProfilesByIds = (userIds: string[]) =>
  wrapAxiosResult(() =>
    api.get<UserProfile[]>(
      `/api/users/profiles?userIds=${JSON.stringify(userIds)}`
    )
  )();

export const patchUserStatus = (status: SelectableUserStatus) =>
  wrapAxiosResult(() =>
    api.patch<{ status: UserStatus }>("/api/users/status", {
      status,
    })
  )();

export const patchUserDisplayName = (displayName: string) =>
  wrapAxiosResult(() =>
    api.patch<{ displayName: string }>("/api/users/display-name", {
      displayName,
    })
  )();
