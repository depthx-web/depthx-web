import { SITE_URL } from "@/lib/site";

const COMPANY_LEGAL_NAME = "Depth X Ltd.";
const COMPANY_NUMBER = "16162223";
const COMPANY_ADDRESS = "71-75 Shelton Street, London, Covent Garden, London, England, WC2H 9JQ";

const SIGNATURE = `—
Depth X
${SITE_URL}
office@depthx.co.uk`;

// Standard business-correspondence confidentiality notice. Not itself a UK
// statutory requirement (unlike the PECR paragraph below), but customary
// and expected on company email — included on every outgoing email.
const CONFIDENTIALITY_NOTICE = `This email and any attachments are confidential and intended solely for the addressee. If you have received this email in error, please notify the sender and delete it; you must not copy, distribute, or act on its contents.

${COMPANY_LEGAL_NAME} · Registered in England & Wales, Company No. ${COMPANY_NUMBER} · ${COMPANY_ADDRESS}`;

/**
 * UK PECR (Privacy and Electronic Communications Regulations) requires
 * marketing email to clearly identify the sender, give a valid postal
 * address, and provide a way to opt out — this paragraph plus the
 * unsubscribe link together cover that. Only appended to genuinely
 * marketing email (the newsletter welcome message, campaigns) — not to
 * transactional email like a reply to a contact-form message or an
 * unsubscribe confirmation, which aren't marketing communications.
 *
 * This wording is a reasonable, researched starting point, not legal
 * advice — same caveat as the /legal pages (see README "Email sending").
 */
function marketingNotice(unsubscribeUrl: string): string {
  return `You're receiving this because you subscribed to updates from ${COMPANY_LEGAL_NAME} at ${SITE_URL}. Unsubscribe at any time: ${unsubscribeUrl}`;
}

/**
 * Appends the standard signature + legal footer to an outgoing email body.
 * Pass `unsubscribeUrl` only for marketing email (welcome message,
 * campaigns) — its presence is what adds the PECR marketing paragraph.
 */
export function appendEmailFooter(body: string, opts?: { unsubscribeUrl?: string }): string {
  const parts = [body.trim(), SIGNATURE];
  if (opts?.unsubscribeUrl) {
    parts.push(marketingNotice(opts.unsubscribeUrl));
  }
  parts.push(CONFIDENTIALITY_NOTICE);
  return parts.join("\n\n");
}
