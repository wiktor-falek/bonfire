import { z } from "zod";

export const recipientId = z.string().length(18);
export const content = z.string().trim().min(1).max(2000);

export const messageSchema = z.object({
  body: z.object({
    recipientId,
    content,
  }),
});
