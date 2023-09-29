import { useQuery } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";

type Message = {
  senderId: string;
  content: string;
  timestamp: number;
};

const useGetMessages = (channelId: string, lastMessageId?: string) =>
  useQuery({
    queryFn: async () => {
      const params = {
        channelId,
        lastMessageId,
      };
      const response = await api.get<Message[]>("/api/messages", { params });
      return response.data.reverse();
    },
    queryKey: ["messages"],
  });

export default useGetMessages;
