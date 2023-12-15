import api from "../configs/axiosConfig";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: "online" | "brb" | "dnd" | "offline";
  imgSrc?: string;
}

async function getCurrentProfile() {
  const response = await api.get<UserProfile>("/api/users/profile/me");
  return response.data;
}

export default getCurrentProfile;
