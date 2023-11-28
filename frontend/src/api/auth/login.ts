import api from "../configs/axiosConfig";
import router from "../../router";

async function login(credentials: { email: string; password: string }) {
  const response = await api.post("/auth/login", credentials);
  if (response.status >= 200 && response.status < 300) {
    localStorage.setItem("authenticated", "true");
    router.push("/app/home");
  }
}

export default login;