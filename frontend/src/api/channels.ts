import api from "./configs/axiosConfig";
import type { UserProfile } from "./users";
import wrapAxiosResult from "./utils/wrapAxiosResult";

export const getOtherParticipantProfileInDirectMessageChannel = (
  channelId: string
) =>
  wrapAxiosResult(() =>
    api.get<UserProfile>(`/api/channels/${channelId}/other-participant-profile`)
  )();
