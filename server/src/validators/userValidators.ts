import { z } from "zod";

const email = z.string().email().min(6).max(256).trim();
const password = z.string().min(8).max(100);
export const username = z.string().min(3).max(32).trim();
const displayName = z.string().max(32).trim().default("");
const sessionId = z.string().min(100).max(200);
export const userId = z.string().length(21);

export const postLoginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});

export const postRegisterSchema = z.object({
  body: z.object({
    email,
    password,
    username,
    displayName,
  }),
});

export const getUserProfileByIdSchema = z.object({
  params: z.object({
    userId,
  }),
});
