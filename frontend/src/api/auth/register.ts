import api from "../configs/axiosConfig";
import router from "../../router";

async function register(credentials: {
  email: string;
  displayName?: string;
  username: string;
  password: string;
}) {
  const response = await api.post("/auth/register", credentials);
  if (response.status >= 200 && response.status < 300) {
    localStorage.setItem("authenticated", "true");
    router.push("/app/home");
  }
}
export default register;
