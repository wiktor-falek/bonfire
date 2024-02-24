import { AxiosError, AxiosResponse } from "axios";
import { Err, Ok } from "resultat";

function wrapAxiosResult<T, E>(
  axiosRequestCb: () => Promise<AxiosResponse<T, E>>
) {
  return async () => {
    try {
      const response = await axiosRequestCb();
      return Ok(response.data);
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      if (!error.response) {
        console.error(error);
        return Err(error);
      }
      return Err(error.response.data as E);
    }
  };
}

export default wrapAxiosResult;
