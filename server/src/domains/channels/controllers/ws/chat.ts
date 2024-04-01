import { z } from "zod";
import type { ServerToClientEvents } from "../../../../websocket/types.js";
import type { WsClient } from "../../../../websocket/wsClient.js";
import type { MessageService } from "../../index.js";
import type { directMessageSchema } from "../../validators/message.js";

export class ChatControllerWS {
  constructor(private messageService: MessageService) {}

  async directMessage(
    client: WsClient<ServerToClientEvents>,
    data: z.infer<typeof directMessageSchema>,
    userId: string
  ) {
    const { recipientId, content } = data;

    const result = await this.messageService.saveDirectMessage(
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
}
