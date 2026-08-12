import type { SiteStat } from "@/lib/types";

export function StatGrid({ stats }: { stats: SiteStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-xl border border-line bg-bg-2 p-6.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.5)]"
        >
          <div className="font-display text-4xl font-bold text-green transition-transform duration-300 group-hover:scale-110">
            {stat.value}
          </div>
          <div className="mt-2 font-mono text-[11px] tracking-wide text-muted">
            {stat.label.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}
