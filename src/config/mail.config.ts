import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: `"${process.env.MAIL_FROM_NAME || "No Reply"}" <${
      process.env.MAIL_FROM || "noreply@example.com"
    }>`,
  },
  template: {
    dir: join(__dirname, "..", "mail", "templates"),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
