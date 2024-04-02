import { Err } from "resultat";
import type { EmailSender } from "../helpers/emailSender.js";

export class EmailService {
  constructor(private emailSender: EmailSender) {}

  /**
   * Sends welcome message sent on account creation.
   * Includes account email confirmation link.
   */
  sendSignupEmail(
    to: string,
    data: { username: string; confirmationToken: string }
  ) {
    return this.emailSender.send({
      to,
      subject: "Welcome to Bonfire — Activate your account",
      text:
        `Hi ${data.username}, Click here to confirm your email address and activate your account\n` +
        `http://localhost:3000/auth/verify/${data.confirmationToken}`,
    });
  }

  /**
   * Sends account email confirmation message with a link.
   */
  sendConfirmationEmail(
    to: string,
    data: { username: string; confirmationToken: string }
  ) {
    return this.emailSender.send({
      to,
      subject: "Activate your account",
      text:
        `Hi ${data.username}, Click here to confirm your email address and activate your account\n` +
        `http://localhost:3000/auth/verify/${data.confirmationToken}`,
    });
  }

  sendPasswordRecovery(
    to: string,
    data: { username: string; recoveryToken: string }
  ) {
    return Err("Not implemented");
  }
}
