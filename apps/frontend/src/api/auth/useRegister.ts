import { useMutation } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";
import router from "../../router";

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
    onSuccess: (res) => {
      localStorage.setItem("authenticated", "true");
      router.push("/app/home");
    },
  });

export default useRegister;
