import "server-only";

const DEFAULT_FROM = "growthrush.ai <onboarding@resend.dev>";
const BRAND = "#4059e8";
const INK = "#0b1220";
const BODY = "#475569";
const MUTED = "#64748b";
const PAGE = "#f3f5fa";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export async function sendResetCodeEmail({
  to,
  code,
  minutes,
  idempotencyKey,
}: {
  to: string;
  code: string;
  minutes: number;
  idempotencyKey: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[portal] Password reset code for ${to}: ${code}`);
      return;
    }
    throw new Error("RESEND_API_KEY must be set.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: [to],
      subject: `${code} is your growthrush.ai password reset code`,
      html: resetCodeHtml(code, minutes),
      text: `Your growthrush.ai password reset code is ${code}. It expires in ${minutes} minutes. If you didn't ask to reset your password, you can ignore this email.`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function resetCodeHtml(code: string, minutes: number) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${PAGE};font-family:${FONT}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px">
            <tr>
              <td>
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND}">Customer portal</p>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${INK}">Reset your password</h1>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${BODY}">Enter this code on the reset page to choose a new password.</p>
                <p style="margin:0 0 24px;padding:16px;border-radius:12px;background:${PAGE};text-align:center;font-size:32px;font-weight:700;letter-spacing:0.3em;color:${INK}">${code}</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED}">This code expires in ${minutes} minutes. If you didn't ask to reset your password, you can ignore this email. Your password won't change.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
