import { useMutation } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";
import router from "../../router";

const useLogin = () =>
  useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      return api.post("/auth/login", credentials);
    },
    onSuccess: (res) => {
      localStorage.setItem("authenticated", "true");

      router.push("/app/home");
    },
  });

export default useLogin;
