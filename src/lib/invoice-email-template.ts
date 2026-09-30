export type InvoiceEmail = {
  invoiceNumber: string;
  paidOn: string;
  planName: string;
  billedTo: { name: string; gstin: string | null; address: string[] } | null;
  placeOfSupply: string | null;
  items: { label: string; detail?: string; paise: number }[];
  totalPaise: number;
  invoiceUrl: string | null;
  siteUrl: string;
};

const BRAND = "#4059e8";
const INK = "#0b1220";
const BODY = "#475569";
const MUTED = "#64748b";
const HAIRLINE = "#e5e7eb";
const PAGE = "#f3f5fa";
const SUCCESS = "#047857";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export const SUPPORT_EMAIL = "Hello@growthrush.ai";
const SELLER_GSTIN = "19AAHCE7862Q1ZN";

export function invoiceEmailHtml(email: InvoiceEmail) {
  const total = rupees(email.totalPaise);
  const label = (text: string) =>
    `<p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED}">${text}</p>`;

  const items = email.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid ${HAIRLINE};font-size:14px;color:${INK}">
          ${escapeHtml(item.label)}
          ${item.detail ? `<div style="margin-top:2px;font-size:12px;color:${MUTED}">${escapeHtml(item.detail)}</div>` : ""}
        </td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid ${HAIRLINE};font-size:14px;color:${INK};white-space:nowrap">${rupees(item.paise)}</td>
      </tr>`,
    )
    .join("");

  const billedTo = email.billedTo
    ? `
      ${label("Billed to")}
      <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};font-weight:600">${escapeHtml(email.billedTo.name)}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:${BODY}">
        ${email.billedTo.address.map(escapeHtml).join("<br>")}
        ${email.billedTo.gstin ? `<br>GSTIN ${escapeHtml(email.billedTo.gstin)}` : ""}
      </p>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <title>Invoice ${escapeHtml(email.invoiceNumber)}</title>
  </head>
  <body style="margin:0;padding:0;background:${PAGE};font-family:${FONT};-webkit-font-smoothing:antialiased">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">
      Payment of ${total} received. Invoice ${escapeHtml(email.invoiceNumber)} for your ${escapeHtml(email.planName)} plan.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE}">
      <tr><td align="center" style="padding:32px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

          <tr><td style="padding:0 4px 20px">
            <a href="${email.siteUrl}" style="text-decoration:none">
              <img src="${email.siteUrl}/brand/wordmark.png" width="156" height="24" alt="growthrush.ai" style="display:block;border:0;width:156px;height:auto">
            </a>
          </td></tr>

          <tr><td style="background:#ffffff;border-radius:16px;border:1px solid ${HAIRLINE};overflow:hidden">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="height:4px;background:${BRAND};font-size:0;line-height:0">&nbsp;</td></tr>

              <tr><td style="padding:32px 32px 28px">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="background:#ecfdf5;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:700;color:${SUCCESS}">&#10003;&nbsp; Payment received</td>
                </tr></table>
                <p style="margin:20px 0 4px;font-size:14px;color:${MUTED}">Amount paid</p>
                <p style="margin:0;font-size:36px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;color:${INK}">${total}</p>
                <p style="margin:14px 0 0;font-size:15px;line-height:1.6;color:${BODY}">
                  Thank you${email.billedTo ? `, ${escapeHtml(email.billedTo.name)}` : ""}. Your <strong style="color:${INK}">${escapeHtml(email.planName)}</strong> plan is now active.
                </p>
              </td></tr>

              <tr><td style="padding:0 32px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px">
                  <tr>
                    <td valign="top" width="50%" style="padding:18px 20px">
                      ${label("Invoice no.")}
                      <p style="margin:0;font-size:14px;font-weight:700;color:${INK};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">${escapeHtml(email.invoiceNumber)}</p>
                    </td>
                    <td valign="top" width="50%" style="padding:18px 20px">
                      ${label("Paid on")}
                      <p style="margin:0;font-size:14px;font-weight:600;color:${INK}">${escapeHtml(email.paidOn)}</p>
                    </td>
                  </tr>
                </table>
              </td></tr>

              ${
                billedTo || email.placeOfSupply
                  ? `<tr><td style="padding:24px 32px 0">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                  <td valign="top" style="padding-right:16px">${billedTo}</td>
                  ${
                    email.placeOfSupply
                      ? `<td valign="top" align="right" style="white-space:nowrap">
                    ${label("Place of supply")}
                    <p style="margin:0;font-size:13px;color:${BODY}">${escapeHtml(email.placeOfSupply)}</p>
                  </td>`
                      : ""
                  }
                </tr></table>
              </td></tr>`
                  : ""
              }

              <tr><td style="padding:28px 32px 0">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 8px;border-bottom:1px solid ${HAIRLINE};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED}">Description</td>
                    <td align="right" style="padding:0 0 8px;border-bottom:1px solid ${HAIRLINE};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED}">Amount</td>
                  </tr>
                  ${items}
                  <tr>
                    <td style="padding:16px 0 0;font-size:15px;font-weight:700;color:${INK}">Total paid</td>
                    <td align="right" style="padding:16px 0 0;font-size:18px;font-weight:800;color:${INK};white-space:nowrap">${total}</td>
                  </tr>
                </table>
              </td></tr>

              ${
                email.invoiceUrl
                  ? `<tr><td align="center" style="padding:32px 32px 0">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="border-radius:12px;background:${BRAND}">
                    <a href="${escapeHtml(email.invoiceUrl)}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px">Download invoice</a>
                  </td>
                </tr></table>
              </td></tr>`
                  : ""
              }

              <tr><td align="center" style="padding:20px 32px 32px">
                <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED}">
                  All your invoices are on your <a href="${email.siteUrl}/billing" style="color:${BRAND};font-weight:600;text-decoration:none">Billing page</a>.
                </p>
              </td></tr>
            </table>
          </td></tr>

          <tr><td align="center" style="padding:24px 16px 0">
            <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED}">
              Questions about this invoice? Write to
              <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND};text-decoration:none">${SUPPORT_EMAIL}</a>
            </p>
            <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#94a3b8">
              growthrush.ai &middot; GSTIN ${SELLER_GSTIN}<br>
              You received this email because you made a payment on growthrush.ai.
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function rupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
