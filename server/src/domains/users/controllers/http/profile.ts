import type { Response } from "express";
import type { ValidatedRequest } from "../../../../types.js";
import type { ProfileService } from "../../services/profile.js";
import type {
  patchUserDisplayName,
  patchUserStatus,
} from "../../validators/status.js";

export class ProfileControllerHttp {
  constructor(private profileService: ProfileService) {}

  async setStatus(
    req: ValidatedRequest<typeof patchUserStatus>,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { status } = req.body;

    const result = await this.profileService.setStatus(userId, status);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({ status: result.val });
  }

  async setDisplayName(
    req: ValidatedRequest<typeof patchUserDisplayName>,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { displayName } = req.body;

    const result = await this.profileService.setDisplayName(
      userId,
      displayName
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({ status: result.val });
  }
}
