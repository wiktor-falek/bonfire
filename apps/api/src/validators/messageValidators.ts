import { z } from "zod";

export const recipientId = z.string().length(21);
export const channelId = z.string().length(21);
export const lastMessageId = z.string().length(24);
export const content = z.string().trim().min(1).max(2000)

export const messageSchema = z.object({
  body: z.object({
    recipientId,
    content,
  }),
});

export const messageQuerySchema = z.object({
  query: z.object({
    channelId,
    lastMessageId: lastMessageId.optional(),
  }),
});
