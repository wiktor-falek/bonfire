import api from "../configs/axiosConfig";

type UserProfile = {
  username: string;
  displayName: string;
  imgSrc: string;
};

async function getCurrentProfile() {
  const response = await api.get<UserProfile>("/api/users/profile/me");
  return response.data;
}

export default getCurrentProfile;
