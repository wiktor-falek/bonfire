import type { Request, Response } from "express";
import type { RequestInfer } from "../types.js";
import type {
  loginSchema,
  registerSchema,
} from "../validators/userValidators.js";
import UserModel from "../models/userModel.js";

export async function login(
  req: RequestInfer<typeof loginSchema>,
  res: Response
) {
  const { email, password } = req.body;

  const result = await UserModel.login(email, password);

  if (!result.ok) {
    return res.status(401).json({ error: result.err });
  }

  const { sessionId } = result.val;

  return res.status(200).json({ sessionId });
}

export async function register(
  req: RequestInfer<typeof registerSchema>,
  res: Response
) {
  const { email, password, username, displayName } = req.body;

  const result = await UserModel.register(
    email,
    password,
    username,
    displayName
  );

  if (!result.ok) {
    return res.status(401).json({ error: result.err });
  }

  return res.status(200).json({ success: true });
}
