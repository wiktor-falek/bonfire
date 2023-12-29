import { AxiosError, AxiosResponse } from "axios";
import { Err, Ok } from "resultat";

function wrapAxiosResult<T>(
  axiosRequestCb: () => Promise<AxiosResponse<T, any>>
) {
  return async () => {
    try {
      const response = await axiosRequestCb();
      return Ok(response.data);
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      return Err(error);
    }
  };
}

export default wrapAxiosResult;
