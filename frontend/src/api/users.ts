import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";

export type UserStatus = "online" | "away" | "dnd" | "offline";

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

export const patchUserStatus = (status: UserStatus) =>
  wrapAxiosResult(() =>
    api.patch<{ status: UserStatus }>("/api/users/status", {
      status,
      clientId: localStorage.getItem("clientId"),
    })
  )();
