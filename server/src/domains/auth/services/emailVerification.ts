import { Err, Ok } from "resultat";
import type { EmailService } from "../../emails/index.js";
import {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  type VerificationTokenPayload,
} from "../helpers/emailVerification.js";

export class EmailVerificationService {
  constructor(private emailService: EmailService) {}

  sendEmailVerification(username: string, payload: VerificationTokenPayload) {
    const verificationToken = generateEmailVerificationToken(payload);
    this.emailService.sendVerificationEmail(payload.email, {
      username,
      verificationToken,
    });
  }

  verifyEmail(token: string) {
    const result = verifyEmailVerificationToken(token);
    if (!result.ok) {
      console.error(result.err);
      return Err("Verification token is invalid or expired");
    }

    return Ok("Successfully verified email");
  }
}
