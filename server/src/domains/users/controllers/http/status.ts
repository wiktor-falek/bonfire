import type { Response } from "express";
import type { ValidatedRequest } from "../../../../types.js";
import type { StatusService } from "../../services/status.js";
import type { patchUserStatus } from "../../validators/status.js";

export class StatusControllerHttp {
  constructor(private statusService: StatusService) {}

  async setStatus(
    req: ValidatedRequest<typeof patchUserStatus>,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { status } = req.body;

    const result = await this.statusService.setStatus(userId, status);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({ status: result.val });
  }
}
