import { z } from "zod";

const channelId = z.string().length(21);
const userId = z.string().length(21);
const lastMessageId = z.string().length(24);
const content = z.string().trim().min(1).max(2000);

export const getMessageSchema = z.object({
  query: z.object({
    channelId,
    lastMessageId: lastMessageId.optional(),
  }),
});

export const postMessageSchema = z.object({
  body: z.object({
    recipientId: userId,
    content,
  }),
});

export const messageEntitySchema = z.object({
  senderId: userId,
  content,
});
