import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { Err, Ok } from "resultat";

export class EmailSender {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(user: string, pass: string) {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  async send(input: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: "Wiktor Falek @Bonfire <falekwiktor@gmail.com>",
        ...input,
      });

      return Ok(info);
    } catch (e) {
      console.error("UNHANDLED ERROR: ", e);
      return Err(e);
    }
  }
}
