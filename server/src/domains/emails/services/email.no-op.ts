import { Ok } from "resultat";
import type { IEmailService } from "./email.interface.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export class NoOpEmailService implements IEmailService {
  constructor() {}

  /**
   * No-op implementation for sending welcome message.
   */
  sendSignupEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ) {
    return Promise.resolve(Ok({} as SMTPTransport.SentMessageInfo));
  }

  /**
   * No-op implementation for sending an account email verification message.
   */
  sendVerificationEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ) {
    return Promise.resolve(Ok({} as SMTPTransport.SentMessageInfo));
  }

  /**
   * No-op implementation for sending a password recovery email.
   */
  sendPasswordRecovery(to: string, data: { username: string }) {
    return Promise.resolve(Ok({} as SMTPTransport.SentMessageInfo));
  }
}
