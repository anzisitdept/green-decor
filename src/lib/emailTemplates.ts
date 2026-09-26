import 'server-only';

import type { Order, ServiceRequest, ContactMessage } from '@/types';
import { CONTACT_PHONE, CONTACT_ADDRESS } from '@/lib/contact';
import type { SendMailInput } from '@/lib/email';

const BRAND = '#38b000';
const INK = '#172b21';
const MUTED = '#52685a';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pkr(amount: number): string {
  return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
}

function layout(title: string, preheader: string, rows: [string, string][], footerNote: string): SendMailInput {
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>
           <td style="padding:10px 0;border-bottom:1px solid #eef2ec;color:${MUTED};font-size:13px;vertical-align:top;width:38%;">${escapeHtml(row[0])}</td>
           <td style="padding:10px 0;border-bottom:1px solid #eef2ec;color:${INK};font-size:14px;font-weight:600;">${row[1]}</td>
         </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f7f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5ece3;">
          <tr>
            <td style="background:${INK};padding:22px 28px;">
              <span style="color:#e8d9b5;font-size:20px;font-weight:800;letter-spacing:.5px;">GREEN DECOR</span>
              <span style="display:block;color:${BRAND};font-size:12px;margin-top:4px;letter-spacing:.14em;text-transform:uppercase;">${escapeHtml(title)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 26px;color:${MUTED};font-size:12px;line-height:1.6;">
              ${footerNote}
              <br /><br />
              <strong style="color:${INK};">Green Decor</strong><br />
              ${escapeHtml(CONTACT_PHONE)} &middot; ${escapeHtml(CONTACT_ADDRESS)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    title.toUpperCase(),
    '',
    ...rows.map(([k, v]) => `${k}: ${stripTags(String(v))}`),
    '',
    footerNote,
    '',
    'Green Decor',
    CONTACT_PHONE,
    CONTACT_ADDRESS,
  ].join('\n');

  return { subject: `[Green Decor] ${title}`, html, text };
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

export function buildOrderNotification(order: Order): SendMailInput {
  const items = order.items
    .map((item) => `${item.product?.name ?? 'Product'} &times; ${item.quantity}`)
    .join(', ');

  const rows: [string, string][] = [
    ['Order ID', escapeHtml(order.id)],
    ['Tracking', escapeHtml(order.trackingNumber)],
    ['Status', escapeHtml(order.status)],
    ['Payment', `${escapeHtml(order.paymentMethod)} (${escapeHtml(order.paymentStatus)})`],
    ['Items', escapeHtml(items)],
    ['Subtotal', pkr(order.subtotal)],
    ['Shipping', pkr(order.shippingFee)],
    ['Discount', pkr(order.discount)],
    ['Total', `<strong>${pkr(order.total)}</strong>`],
  ];

  if (order.promoCode) rows.push(['Promo code', escapeHtml(order.promoCode)]);

  const a = order.shippingAddress;
  rows.push(
    ['Customer', escapeHtml(a.fullName)],
    ['Phone', escapeHtml(a.phone)],
    ['Email', escapeHtml(a.email)],
    ['Address', escapeHtml([a.streetAddress, a.city, a.province, a.postalCode].filter(Boolean).join(', '))]
  );

  return layout(
    'New order received',
    `Order ${order.id} for ${pkr(order.total)} from ${a.fullName}`,
    rows,
    'A new order has been placed on the storefront. Review it in the admin panel to confirm and begin processing.'
  );
}

export function buildQuoteNotification(request: ServiceRequest): SendMailInput {
  const rows: [string, string][] = [
    ['Request ID', escapeHtml(request.id)],
    ['Service', escapeHtml(request.serviceTitle)],
    ['Name', escapeHtml(request.fullName)],
    ['Phone', escapeHtml(request.phone)],
    ['Email', escapeHtml(request.email)],
    ['City', escapeHtml(request.city)],
    ['Property type', escapeHtml(request.propertyType)],
  ];

  if (request.budget) rows.push(['Budget', escapeHtml(request.budget)]);

  rows.push(['Message', escapeHtml(request.message).replace(/\n/g, '<br />')]);

  return layout(
    'New quote request',
    `Quote request for ${request.serviceTitle} from ${request.fullName} in ${request.city}`,
    rows,
    'A visitor requested a quote. Reply to them directly, or manage this request in the admin panel.'
  );
}

export function buildContactNotification(message: ContactMessage): SendMailInput {
  const rows: [string, string][] = [
    ['Inquiry ID', escapeHtml(message.id)],
    ['Name', escapeHtml(message.name)],
    ['Email', escapeHtml(message.email)],
    ['Phone', escapeHtml(message.phone)],
    ['Subject', escapeHtml(message.subject)],
    ['Message', escapeHtml(message.message).replace(/\n/g, '<br />')],
  ];

  return layout(
    'New contact message',
    `${message.subject} from ${message.name}`,
    rows,
    'Someone contacted you through the website contact form. Reply directly to their email address.'
  );
}
