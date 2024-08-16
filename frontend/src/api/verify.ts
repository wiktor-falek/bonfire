import wrapAxiosResult from "./utils/wrapAxiosResult";
import api from "./configs/axiosConfig";
import { ErrorResponse } from "./types";

export type VerifyResult = {};

export const verify = (token: string) =>
  wrapAxiosResult<VerifyResult, ErrorResponse>(() =>
    api.post(`/verify?token=${token}`)
  )();
