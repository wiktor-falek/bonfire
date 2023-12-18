import { Err, Ok } from "resultat";
import api from "../configs/axiosConfig";
import type { UserProfile } from "../users/getCurrentProfile";

export async function getOtherParticipantProfileInDirectMessageChannel(
  channelId: string
) {
  try {
    const response = await api.get<UserProfile>(
      `/api/channels/${channelId}/other-participant-profile`
    );
    return Ok(response.data);
  } catch (e) {
    return Err(e);
  }
}

export default getOtherParticipantProfileInDirectMessageChannel;
