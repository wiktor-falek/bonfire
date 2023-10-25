import api from "../configs/axiosConfig";

export type Message = {
  senderId: string;
  content: string;
  timestamp: number;
};

async function getMessages(channelId: string, lastMessageId?: string) {
  try {
    const response = await api.get<Message[]>("/api/messages", {
      params: { channelId, lastMessageId },
    });
    return response.data.reverse();
  } catch {
    return [];
  }
}

export default getMessages;
