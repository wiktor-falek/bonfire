import wrapAxiosResult from "./utils/wrapAxiosResult";
import api from "./configs/axiosConfig";
import { ErrorResponse } from "./types";

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
}) =>
  wrapAxiosResult<Account, ErrorResponse>(() =>
    api.post("/auth/register", credentials)
  )();

export const login = (credentials: { email: string; password: string }) =>
  wrapAxiosResult<Account, ErrorResponse>(() =>
    api.post("/auth/login", credentials)
  )();
