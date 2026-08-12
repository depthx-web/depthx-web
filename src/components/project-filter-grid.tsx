"use client";

import { useState } from "react";
import type { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/ui/project-card";

const FILTERS: { key: "all" | ProjectStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "granted", label: "Patent Granted" },
  { key: "pending", label: "Patent Pending" },
  { key: "licensing", label: "Available for Licensing" },
];

export function ProjectFilterGrid({
  projects,
  showFilters,
}: {
  projects: Project[];
  showFilters: boolean;
}) {
  const [active, setActive] = useState<"all" | ProjectStatus>("all");
  const visible = active === "all" ? projects : projects.filter((p) => p.status === active);

  return (
    <>
      {showFilters && (
        <div className="mb-9 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2.25 font-mono text-xs transition-all duration-150 active:scale-95 ${
                active === f.key
                  ? "border-text bg-text text-bg"
                  : "border-line text-muted hover:border-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </>
  );
}
