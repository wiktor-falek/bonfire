import type { Response } from "express";
import type { RequestInfer } from "../types.js";
import type {
  loginSchema,
  registerSchema,
} from "../validators/userValidators.js";
import AuthService from "../services/authService.js";

export async function login(
  req: RequestInfer<typeof loginSchema>,
  res: Response
) {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  if (!result.ok) {
    return res.status(401).json({ error: result.err });
  }

  const { user, sessionId } = result.val;
  const { username } = user.account;

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 24 * 1000, // one month
  });

  return res.status(200).json({ authenticated: true, username });
}

export async function register(
  req: RequestInfer<typeof registerSchema>,
  res: Response
) {
  const { email, password, username, displayName } = req.body;

  console.log(req.body);

  const result = await AuthService.register(
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
