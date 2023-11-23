import { messageService } from "../../instances.js";
import { z } from "zod";
import type WsClient from "../wsClient.js";
import type { ServerToClientEvents } from "../types.js";

const sendDirectMessageSchema = z
  .object({
    recipientId: z.string(),
    content: z.string(),
  })
  .strict();

async function directMessage(
  client: WsClient<ServerToClientEvents>,
  data: any,
  userId: string
) {
  // TODO: find a cleaner solution
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

  // TODO: client.send("ACK_chat:message", null);
  client.send("chat:message", message);

  const userClientsNamespace = `user_${recipientId}`;
  client.to(userClientsNamespace).send("chat:message", message);
}

export default {
  directMessage,
};
