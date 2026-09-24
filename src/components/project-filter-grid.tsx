"use client";

import { useState } from "react";
import type { DevelopmentStage, Project } from "@/lib/types";
import { ProjectCard } from "@/components/ui/project-card";
import { DEVELOPMENT_STAGES } from "@/lib/project-status";

const FILTERS: { key: "all" | DevelopmentStage; label: string }[] = [
  { key: "all", label: "All" },
  ...DEVELOPMENT_STAGES.map(({ value, adminLabel }) => ({ key: value, label: adminLabel })),
];

export function ProjectFilterGrid({
  projects,
  showFilters,
}: {
  projects: Project[];
  showFilters: boolean;
}) {
  const [active, setActive] = useState<"all" | DevelopmentStage>("all");
  const visible =
    active === "all" ? projects : projects.filter((p) => p.developmentStage === active);

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
