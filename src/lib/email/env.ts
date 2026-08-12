export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
export const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

export const hasSmtpConfig = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASSWORD);
