import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import type { Result } from "resultat";

export type IEmailService = {
  sendSignupEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ): Promise<Result<SMTPTransport.SentMessageInfo, unknown>>;
  sendVerificationEmail(
    to: string,
    data: { username: string; verificationToken: string }
  ): Promise<Result<SMTPTransport.SentMessageInfo, unknown>>;
  sendPasswordRecovery(
    to: string,
    data: { username: string }
  ): Promise<Result<SMTPTransport.SentMessageInfo, unknown>>;
};
