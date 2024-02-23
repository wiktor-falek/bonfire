import axios, { type AxiosError } from "axios";
import router from "../../router";

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000/",
});

const errorHandler = (error: AxiosError) => {
  const statusCode = error.response?.status;

  if (statusCode === 401) {
    localStorage.setItem("authenticated", "false");
    router.push("/login");
  }

  return Promise.reject(error);
};

api.interceptors.response.use(undefined, (error: AxiosError) => {
  return errorHandler(error);
});

export default api;
