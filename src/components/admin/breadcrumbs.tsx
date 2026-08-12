import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted">
      <Link href="/admin" className="hover:text-text">
        Dashboard
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="text-line-2">/</span>
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
  );
}
