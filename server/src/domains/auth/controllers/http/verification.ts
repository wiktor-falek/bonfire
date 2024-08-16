import type { Response } from "express";
import type { ValidatedRequest } from "../../../../types.js";
import { type EmailVerificationService } from "../../services/emailVerification.js";
import { postVerifyToken } from "../../validators/verify.js";

export class VerificationControllerHTTP {
  constructor(private emailVerificationService: EmailVerificationService) {}

  async verifyToken(
    req: ValidatedRequest<typeof postVerifyToken>,
    res: Response
  ) {
    const { token } = req.query;

    const result = await this.emailVerificationService.verifyEmail(token);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({ message: "Email verified" });
  }

  async resendTokenToEmail(req: ValidatedRequest<{}>, res: Response) {}

  async changeEmailAndSendToken(req: ValidatedRequest<{}>, res: Response) {}
}
