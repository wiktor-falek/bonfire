import { z } from "zod";

export const directMessageSchema = z.strictObject({
  recipientId: z.string(),
  content: z.string(),
});

export const userProfilesSchema = z.strictObject({
  profileIds: z.array(z.string()),
});
