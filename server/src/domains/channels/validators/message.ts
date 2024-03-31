import { z } from "zod";
import { userId } from "../../users/validators/user.js";
import { channelId } from "./channel.js";

export const messageId = z.string().length(24);
export const content = z.string().trim().min(1).max(2000);

export const getMessageSchema = z.object({
  query: z.object({
    channelId,
    lastMessageId: messageId.optional(),
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
