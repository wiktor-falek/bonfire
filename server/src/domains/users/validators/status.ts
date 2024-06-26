import { z } from "zod";

export const status = z.enum(["online", "offline", "dnd", "away"]);

export const patchUserStatus = z.object({
  body: z.object({
    status,
  }),
});
