import Script from "next/script";

/** No-ops until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set — see README "Analytics". */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
