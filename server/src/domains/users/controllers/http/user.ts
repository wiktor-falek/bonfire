import type { Request, Response } from "express";
import type { ValidatedRequest } from "../../../../types.js";
import type { UserService } from "../../services/user.js";
import {
  userProfilesSchema,
  type getUserProfileByIdSchema,
} from "../../validators/user.js";

export class UserControllerHttp {
  constructor(private userService: UserService) {}

  async getCurrentUserProfile(req: Request, res: Response) {
    const userId = res.locals.user.id;

    const result = await this.userService.getCurrentUserProfileById(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const userProfile = result.val;

    return res.status(200).json(userProfile);
  }

  async getUserProfile(
    req: ValidatedRequest<typeof getUserProfileByIdSchema>,
    res: Response
  ) {
    const { userId } = req.params;

    const result = await this.userService.getUserProfileById(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const userProfile = result.val;

    return res.status(200).json(userProfile);
  }

  async getUserProfiles(req: Request, res: Response) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    // TODO: find a flexible solution for validating query in validation layer
    const _userIds = req.query.userIds?.toString();
    const validation = userProfilesSchema.safeParse(
      JSON.parse(_userIds ?? "[]")
    );

    if (!validation.success) {
      return res.status(422).json({ error: validation.error.issues });
    }

    const userIds = validation.data;

    const result = await this.userService.getUserProfilesByIds(userIds);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const userProfiles = result.val;

    return res.status(200).json(userProfiles);
  }
}
