import { z } from "zod";

const status = z.enum(["online", "offline", "dnd", "away"]);

export const patchUserStatus = z.object({
  body: z.object({
    status,
    clientId: z.string(),
  }),
});
