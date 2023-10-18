import { messageService } from "../../instances.js";
import { z } from "zod";
import type WsClient from "../wsClient.js";

const sendDirectMessageSchema = z
  .object({
    recipientId: z.string(),
    content: z.string(),
  })
  .strict();

async function directMessage(client: WsClient, data: any, userId: string) {
  const validation = sendDirectMessageSchema.safeParse(data);
  if (!validation.success) {
    return client.send("error", { reason: "Invalid Schema" });
  }

  const { recipientId, content } = validation.data;

  const result = await messageService.sendDirectMessage(
    userId,
    recipientId,
    content
  );

  if (!result.ok) {
    return client.send("error", { reason: result.err });
  }

  const message = result.val;

  // TODO: send ACK instead
  client.send("chat:message", message.toJson());

  const userNamespace = `user_${userId}`;
  client.broadcast.to(userNamespace).send("chat:message", message.toJson());
}

export default {
  directMessage,
};
