import { z } from "zod";
import { displayName, email, password, username } from "../../users/index.js";

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
