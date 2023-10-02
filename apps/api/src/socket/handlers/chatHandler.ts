import type { WebSocket } from "ws";
import { broadcastEmit } from "../utils.js";
import { channelModel } from "../../instances.js";
import Message from "../../entities/message.js";

function registerChatHandler(ws: WebSocket, userId: string) {
  const directMessage = async (
    channelId: string,
    recipientId: string,
    content: string
  ) => {
    // TODO: read from redis cache
    const participantChannels = await channelModel.findAllChannelIdsByUserId(
      userId
    );

    if (!participantChannels.includes(channelId)) {
      ws.send(JSON.stringify({ error: "Not Authorizedl" }));
    }

    const result = await channelModel.sendDirectMessage(
      channelId,
      recipientId,
      new Message(userId, content)
    );

    if (!result.ok) {
      console.error(result.err);
      return;
    }

    const message = result.val;

    broadcastEmit(ws, "chat:message", { message });
  };

  ws.on("chat:direct-message", directMessage);
}

export default registerChatHandler;
