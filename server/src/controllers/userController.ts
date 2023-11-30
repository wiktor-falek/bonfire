import type { ValidatedRequest } from "../types.js";
import type { Request, Response } from "express";
import type { getUserProfileByIdSchema } from "../validators/userValidators.js";
import type UserService from "../services/userService.js";

class UserController {
  constructor(private userService: UserService) {}

  async getCurrentUserProfileInfo(req: Request, res: Response) {
    const userId = res.locals.user.id;

    const result = await this.userService.getUserProfileInfo(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const profileInfo = result.val;

    return res.status(200).json(profileInfo);
  }

  async getUserProfileInfoById(
    req: ValidatedRequest<typeof getUserProfileByIdSchema>,
    res: Response
  ) {
    const { userId } = req.params;

    const result = await this.userService.getUserProfileInfo(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const profileInfo = result.val;

    return res.status(200).json(profileInfo);
  }
}

export default UserController;
