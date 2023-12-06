import { AxiosError } from "axios";
import api from "../configs/axiosConfig";
import { Err, Ok } from "resultat";

async function postFriendInviteByUsername(username: string) {
  try {
    const response = await api.post<{}>(
      "/api/relationships/send-friend-request-by-username",
      { username }
    );

    return Ok(response.data);
  } catch (e) {
    const error = e as AxiosError;
    const data = error.response?.data as { error: string };
    return Err(data);
  }
}

export default postFriendInviteByUsername;
