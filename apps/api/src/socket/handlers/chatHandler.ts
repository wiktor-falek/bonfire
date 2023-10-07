import type { WebSocket } from "ws";
import { broadcastSend, send } from "../utils.js";
import { channelModel } from "../../instances.js";
import Message from "../../entities/message.js";

export async function directMessageHandler(
  ws: WebSocket,
  userId: string,
  data: { channelId: string; recipientId: string; content: string }
) {
  console.log("direct message handler");
  const { channelId, recipientId, content } = data;

  const participantChannels = await channelModel.findAllChannelIdsByUserId(
    userId
  );

  if (!participantChannels.includes(channelId)) {
    send(ws, "error", { reason: "Not Authorized" });
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

  broadcastSend(ws, "chat:message", message);
}
