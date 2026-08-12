import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { SITE_URL } from "@/lib/site";

export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `${SITE_URL}${item.href === "/" ? "" : item.href}` } : {}),
          })),
        }}
      />
      <div className="flex items-center gap-2 px-8 pt-28 font-mono text-xs text-muted md:px-25 md:pt-28">
        {trail.map((item, i) => (
          <span key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-line-2">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-text">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  eyebrowColor,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  eyebrowColor?: string;
}) {
  return (
    <div className="px-8 pt-6 pb-15 md:px-25">
      <div
        className="mb-5 font-mono text-xs tracking-widest text-amber"
        style={eyebrowColor ? { color: eyebrowColor } : undefined}
      >
        {eyebrow}
      </div>
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4.5 max-w-2xl text-base leading-7 text-muted">{description}</p>
      )}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  action,
  bordered = true,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={`mb-13 flex flex-wrap items-end justify-between gap-5 pb-6.5 ${
        bordered ? "border-b border-line" : ""
      }`}
    >
      <div>
        <div className="mb-2.5 font-mono text-xs tracking-widest text-muted">{eyebrow}</div>
        <h2 className="font-display text-3xl font-semibold md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
