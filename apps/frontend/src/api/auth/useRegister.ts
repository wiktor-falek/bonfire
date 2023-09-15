import { useMutation } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";

const useRegister = () =>
  useMutation({
    mutationFn: (credentials: {
      email: string;
      displayName?: string;
      username: string;
      password: string;
    }) => {
      return api.post("/auth/register", credentials);
    },
  });

export default useRegister;
