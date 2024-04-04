import type { EmailSender } from "../helpers/emailSender.js";
import type { IEmailService } from "./email.interface.js";

export class EmailService implements IEmailService {
  constructor(private emailSender: EmailSender) {}

  /**
   * Sends welcome message that includes account email verification link.
   */
  sendSignupEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ) {
    return this.emailSender.send({
      to,
      subject: "Welcome to Bonfire — Activate your account",
      text:
        `Hi ${data.username}, Click here to confirm your email address and activate your account\n` +
        `http://localhost:3000/auth/verify/${data.verificationToken}\n` +
        `This link will expire in 24 hours.`,
    });
  }

  /**
   * Sends an account email verification link.
   */
  sendVerificationEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ) {
    return this.emailSender.send({
      to,
      subject: "Activate your account",
      text:
        `Hi ${data.username}, Click here to confirm your email address and activate your account\n` +
        `http://localhost:3000/auth/verify/${data.verificationToken}\n` +
        `This link will expire in 24 hours.`,
    });
  }

  /**
   * Sends a password recovery link.
   */
  sendPasswordRecovery(to: string, data: { username: string }) {
    return this.emailSender.send({
      to,
      subject: "Password Recovery",
      text: "Not Implemented",
    });
  }
}
