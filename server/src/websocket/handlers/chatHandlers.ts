import { z } from "zod";
import type WsClient from "../wsClient.js";
import type { ServerToClientEvents } from "../types.js";
import { messageService } from "../../instances.js";
import { createHandler } from "./handler.js";

const directMessageSchema = z.strictObject({
  recipientId: z.string(),
  content: z.string(),
});

async function directMessageHandler(
  client: WsClient<ServerToClientEvents>,
  data: z.infer<typeof directMessageSchema>,
  userId: string
) {
  const { recipientId, content } = data;

  const result = await messageService.saveDirectMessage(
    userId,
    recipientId,
    content
  );

  if (!result.ok) {
    return client.send("error", { reason: result.err });
  }

  const message = result.val;

  console.log({ message });

  // TODO: implement ACK
  client.send("chat:message", message);

  const userClientsNamespace = `user_${recipientId}`;
  client.to(userClientsNamespace).send("chat:message", message);
}

export const directMessage = createHandler(
  directMessageHandler,
  directMessageSchema
);
