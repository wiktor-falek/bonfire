import { z } from "zod";

export const email = z.string().email().min(6).max(256).trim();
export const password = z.string().min(8).max(100);
export const username = z.string().min(3).max(32).trim();
export const displayName = z.string().max(32).trim().default("");
export const userId = z.string().length(21);

export const userProfilesSchema = z.array(userId);

export const userProfileIdsSchema = z.strictObject({
  profileIds: z.array(z.string()),
});

export const getUserProfileByIdSchema = z.object({
  params: z.object({
    userId,
  }),
});
