import { z } from "zod";

export const channelId = z.string().length(21);

export const getOtherUserProfileInDirectMessageChannelSchema = z.object({
  params: z.object({
    channelId,
  }),
});
