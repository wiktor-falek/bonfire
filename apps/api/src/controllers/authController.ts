import type { Request, Response } from "express";
import type {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import { createSessionToken } from "../helpers/sessionToken.js";
import { authService } from "../instances.js";
import type { z } from "zod";
import type { ValidatedRequest } from "../types.js";

export async function login(
  req: ValidatedRequest<typeof postLoginSchema>,
  res: Response
) {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  if (!result.ok) {
    console.error(result.err);
    return res.status(401).json({ error: result.err });
  }

  const { user, sessionId } = result.val;
  const { id } = user;
  const { username, displayName } = user.account;

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 24 * 1000, // one month
  });

  return res.status(200).json({ username, displayName, email });
}

export async function register(
  req: Request & z.infer<typeof postRegisterSchema>,
  res: Response
) {
  const { email, password, username, displayName } = req.body;

  const result = await authService.register(
    email,
    password,
    username,
    displayName
  );

  if (!result.ok) {
    console.log(result.err);
    return res.status(401).json({ error: result.err });
  }

  return res.status(200).json({ success: true });
}
