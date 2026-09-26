import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  to: string;
  dryRun: boolean;
}

export function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  const fromEmail = process.env.SMTP_FROM_EMAIL || user;
  const to = process.env.NOTIFY_EMAIL || user;
  const port = Number(process.env.SMTP_PORT ?? 465);

  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 465,
    secure: (process.env.SMTP_SECURE ?? 'true') !== 'false',
    user,
    pass,
    fromName: process.env.SMTP_FROM_NAME || 'Green Decor',
    fromEmail,
    to,
    dryRun: (process.env.NOTIFY_DRY_RUN ?? 'false') === 'true',
  };
}

let cached: Transporter | null = null;

function getTransport(config: MailConfig): Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    // Without these a half-open SMTP connection can hold a serverless
    // invocation open until the platform kills it.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return cached;
}

export interface SendMailInput {
  subject: string;
  html: string;
  text: string;
}

export type SendMailResult =
  | { sent: true; dryRun: boolean; messageId?: string }
  | { sent: false; reason: 'not_configured' | 'failed'; error: string };

/**
 * Sends one notification. Never throws: callers treat notification delivery as
 * best-effort so a mail outage can never roll back a customer order.
 */
export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const config = getMailConfig();

  if (!config) {
    return { sent: false, reason: 'not_configured', error: 'SMTP environment variables are missing.' };
  }

  if (config.dryRun) {
    console.info('[notify:dry-run]', input.subject, '\n', input.text);
    return { sent: true, dryRun: true };
  }

  try {
    const info = await getTransport(config).sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { sent: true, dryRun: false, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown SMTP error';
    console.error('[notify:send-failed]', message);
    return { sent: false, reason: 'failed', error: message };
  }
}
