import api from "../configs/axiosConfig";

export type Message = {
  senderId: string;
  content: string;
  timestamp: number;
};

async function getMessages(channelId: string, lastMessageId?: string) {
  console.log({ channelId });
  const response = await api.get<Message[]>("/api/messages", {
    params: { channelId, lastMessageId },
  });
  return response.data.reverse();
}

export default getMessages;
