import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: "online" | "away" | "dnd" | "offline";
  imgSrc?: string;
};

export const getCurrentProfile = wrapAxiosResult(() =>
  api.get<UserProfile>("/api/users/profile/me")
);

export const getUserProfileById = (userId: string) =>
  wrapAxiosResult(() => api.get<UserProfile>(`/api/users/profile/${userId}`))();
