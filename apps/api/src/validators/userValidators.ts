import { z } from "zod";

export const email = z.string().email().min(6).max(256).trim();
export const password = z.string().min(8).max(100);
export const username = z.string().min(3).max(32).trim();
export const displayName = z.string().max(32).trim().default("");
export const sessionId = z.string().min(100).max(200)

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
