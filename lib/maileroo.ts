import nodemailer from "nodemailer";

const host = process.env.MAILEROO_SMTP_HOST;

export const mailerooTransporter = nodemailer.createTransport({
  host,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILEROO_SMTP_USER,
    pass: process.env.MAILEROO_SMTP_PASSWORD,
  },
});
