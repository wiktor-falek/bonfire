import type { Response } from "express";
import type { RequestInfer } from "../types.js";
import type {
  loginSchema,
  registerSchema,
} from "../validators/userValidators.js";
import { createSessionToken } from "../helpers/sessionToken.js";
import { authService } from "../instances.js";

export async function login(
  req: RequestInfer<typeof loginSchema>,
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

  const sessionToken = createSessionToken({
    id,
    username,
  });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 24 * 1000, // one month
  });

  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 24 * 1000, // one month
  });

  return res.status(200).json({ username, displayName, email });
}

export async function register(
  req: RequestInfer<typeof registerSchema>,
  res: Response
) {
  const { email, password, username, displayName } = req.body;

  console.log(req.body);

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
