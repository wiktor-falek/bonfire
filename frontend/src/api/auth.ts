import wrapAxiosResult from "./utils/wrapAxiosResult";
import api from "./configs/axiosConfig";

export type Account = {
  username: string;
  email: string;
  displayName: string;
};

export const register = (credentials: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}) => wrapAxiosResult(() => api.post<Account>("/auth/register", credentials))();

export const login = (credentials: { email: string; password: string }) =>
  wrapAxiosResult(() => api.post<Account>("/auth/login", credentials))();
