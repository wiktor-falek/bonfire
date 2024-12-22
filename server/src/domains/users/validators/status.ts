import { z } from "zod";
import { displayName } from "./user.js";

export const status = z.enum(["online", "away", "dnd", "invisible"]);

export const patchUserStatus = z.object({
  body: z.object({
    status,
  }),
});

export const patchUserDisplayName = z.object({
  body: z.object({
    displayName,
  }),
});
