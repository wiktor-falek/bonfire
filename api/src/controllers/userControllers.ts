import type { ValidatedRequest } from "../types.js";
import type { Request, Response } from "express";
import { userService } from "../instances.js";
import type { getUserProfileByIdSchema } from "../validators/userValidators.js";

export async function getCurrentUserProfileInfo(req: Request, res: Response) {
  const userId = res.locals.user.id;

  const result = await userService.getUserProfileInfo(userId);

  if (!result.ok) {
    return res.status(400).json({ error: result.err });
  }

  const profileInfo = result.val;

  return res.status(200).json(profileInfo);
}

export async function getUserProfileInfoById(
  req: ValidatedRequest<typeof getUserProfileByIdSchema>,
  res: Response
) {
  const { userId } = req.params;

  const result = await userService.getUserProfileInfo(userId);

  if (!result.ok) {
    return res.status(400).json({ error: result.err });
  }

  const profileInfo = result.val;

  return res.status(200).json(profileInfo);
}
