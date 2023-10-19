import api from "../configs/axiosConfig";

type UserProfile = {
  displayName: string;
  name: string;
  imgSrc: string;
};

async function getUserProfileById(userId: string) {
  const response = await api.get<UserProfile[]>(`/api/users/profile/${userId}`);
  return response.data;
}

export default getUserProfileById;
