import { useMutation } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";

const useLogin = () =>
  useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      return api.post("/auth/login", credentials);
    },
  });

export default useLogin;
