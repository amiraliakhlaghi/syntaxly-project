import nodemailer from "nodemailer";

export const mailerooTransporter = nodemailer.createTransport({
  host: "smtp.maileroo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILEROO_SMTP_USER,
    pass: process.env.MAILEROO_SMTP_PASSWORD,
  },
});
