import { z } from "zod";

export const token = z.string().min(150).max(600);

export const postVerifyToken = z.object({
  query: z.object({
    token,
  }),
});
