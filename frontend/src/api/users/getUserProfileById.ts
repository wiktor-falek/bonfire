import api from "../configs/axiosConfig";
import type { UserProfile } from "./getCurrentProfile";

async function getUserProfileById(userId: string) {
  const response = await api.get<UserProfile>(`/api/users/profile/${userId}`);
  return response.data;
}

export default getUserProfileById;
