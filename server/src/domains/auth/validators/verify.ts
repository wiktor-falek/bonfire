import { z } from "zod";
import { email, username } from "../../users/index.js";
import { generateEmailVerificationToken } from "../helpers/emailVerification.js";

// TODO: cleanup

function string(len: number) {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += "1";
  }
  return s;
}

const shortestToken = generateEmailVerificationToken({
  username: string(username.minLength!),
  email: string(email.minLength!),
});

const longestToken = generateEmailVerificationToken({
  username: string(username.maxLength!),
  email: string(email.maxLength!),
});

export const token = z
  .string()
  .min(shortestToken.length)
  .max(longestToken.length);

export const getVerifyToken = z.object({
  query: z.object({
    token,
  }),
});
