import { Err } from "resultat";
import type { IEmailService } from "../../emails/services/email.interface.js";
import type { IUserModel } from "../../users/models/user.interface.js";
import {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  type VerificationTokenPayload,
} from "../helpers/emailVerification.js";

export class EmailVerificationService {
  constructor(
    private userModel: IUserModel,
    private emailService: IEmailService
  ) {}

  async verifyEmail(token: string) {
    const verifyResult = verifyEmailVerificationToken(token);
    if (!verifyResult.ok) {
      return verifyResult;
    }

    const { username, email } = verifyResult.val;

    const emailIsVerifiedResult = await this.userModel.emailIsVerified(email);

    if (!emailIsVerifiedResult.ok) {
      return emailIsVerifiedResult;
    }

    const emailIsVerified = emailIsVerifiedResult.val;

    if (emailIsVerified) {
      return Err("Email is already in use");
    }

    return this.userModel.verifyEmail(username, email);
  }

  sendEmailVerification(username: string, payload: VerificationTokenPayload) {
    const verificationToken = generateEmailVerificationToken(payload);
    const result = this.emailService.sendVerificationEmail(payload.email, {
      username,
      verificationToken,
    });
    return result;
  }

  async changeEmailAndSendVerification(
    username: string,
    payload: VerificationTokenPayload
  ) {
    const result = await this.userModel.changeEmail(username, payload.email);

    if (!result.ok) {
      return result;
    }

    return this.sendEmailVerification(username, payload);
  }
}
