import { useQuery } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";

type UserProfile = {
  displayName: string;
  name: string;
  imgSrc: string;
};

const useGetCurrentProfile = () =>
  useQuery({
    queryFn: async () => {
      const response = await api.get<UserProfile[]>("/api/users/profile/me");
      return response.data;
    },
    queryKey: ["messages"],
    staleTime: Infinity,
  });

export default useGetCurrentProfile;
