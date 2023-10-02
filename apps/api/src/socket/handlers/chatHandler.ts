import type { WebSocket } from "ws";
import { broadcastEmit } from "../utils.js";
import { messageModel } from "../../instances.js";
import Message from "../../entities/message.js";

function registerChatHandler(ws: WebSocket, userId: string) {
  const message = async (channelId: string, content: string) => {
    // TODO: cache using redis
    // const participantChannels = await channelModel.findAllChannelsByUserId(
    //   userId
    // );

    const participantChannels = [] as string[];

    if (!participantChannels.includes(channelId)) {
      ws.send(JSON.stringify({ error: "Not Authorizedl" }));
    }

    const result = await messageModel.sendToChannel(
      channelId,
      new Message(userId, content)
    );

    if (!result.ok) {
      console.error(result.err);
      return;
    }

    const message = result.val;

    broadcastEmit(ws, "chat:message", { message });
  };

  ws.on("chat:message", message);
}

export default registerChatHandler;
