import api from "../configs/axiosConfig";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  imgSrc: string;
};

async function getUserProfileById(userId: string) {
  const response = await api.get<UserProfile>(`/api/users/profile/${userId}`);
  return response.data;
}

export default getUserProfileById;
