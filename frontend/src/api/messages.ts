import api from "./configs/axiosConfig";
import wrapAxiosResult from "./utils/wrapAxiosResult";

export type Message = {
  senderId: string;
  content: string;
  timestamp: number;
};

export const getMessages = (channelId: string, lastMessageId?: string) =>
  wrapAxiosResult(async () => {
    const response = await api.get<Message[]>("/api/messages", {
      params: { channelId, lastMessageId },
    });
    response.data = response.data.reverse();
    return response;
  })();
