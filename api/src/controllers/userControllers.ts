import type { ValidatedRequest } from "../types.js";
import type { Response } from "express";
import { userService } from "../instances.js";
import type { z } from "zod";

export async function getCurrentUserProfileInfo(
  req: ValidatedRequest<typeof z.any>,
  res: Response
) {
  const userId = res.locals.user.id;

  const result = await userService.getUserProfileInfo(userId);

  if (!result.ok) {
    return res.status(400).json({ error: result.err });
  }

  const profileInfo = result.val;

  return res.status(200).json(profileInfo);
}

export async function getUserProfileInfoById(
  req: ValidatedRequest<typeof z.any>,
  res: Response
) {
  // TODO: Request schema, params: { userId: string }
  const { userId } = req.params;

  const result = await userService.getUserProfileInfo(userId);

  if (!result.ok) {
    return res.status(400).json({ error: result.err });
  }

  const profileInfo = result.val;

  return res.status(200).json(profileInfo);
}
