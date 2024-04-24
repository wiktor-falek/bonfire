import { z } from "zod";

export const status = z.enum(["online", "away", "dnd", "invisible"]);

export const patchUserStatus = z.object({
  body: z.object({
    status,
  }),
});
