"use client";

import { useState } from "react";
import type { ContactRole } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

const ROLES: Record<
  ContactRole,
  { label: string; tag: string; title: string; desc: string; colorClass: string; btnClass: string }
> = {
  investor: {
    label: "Investors",
    tag: "FOR INVESTORS",
    title: "Invest in licensing-ready technology",
    desc: "Speak directly with our team about licensing, commercial usage rights, or investment in upcoming development stages.",
    colorClass: "border-green text-green",
    btnClass: "bg-green text-[#06140F] hover:bg-[#5EE6B4]",
  },
  researcher: {
    label: "Researchers & Universities",
    tag: "FOR RESEARCHERS & UNIVERSITIES",
    title: "Collaborate with our research team",
    desc: "We welcome partnerships for experimental validation and joint publication across our research domains.",
    colorClass: "border-blue text-blue",
    btnClass: "border border-blue/40 bg-blue/10 text-blue hover:bg-blue/20",
  },
  company: {
    label: "Companies & Industry",
    tag: "FOR COMPANIES & INDUSTRIAL PARTNERS",
    title: "Bring Depth X technology into your operations",
    desc: "Explore joint development, pilot deployments, or integrating a licensed system into your products.",
    colorClass: "border-amber text-amber",
    btnClass: "border border-amber/40 bg-amber/10 text-amber hover:bg-amber/20",
  },
};

export function RoleToggle({
  emails,
  value,
  onChange,
}: {
  emails: Record<ContactRole, string>;
  value?: ContactRole;
  onChange?: (role: ContactRole) => void;
}) {
  const [internalRole, setInternalRole] = useState<ContactRole>("investor");
  const activeRole = value ?? internalRole;
  const setRole = onChange ?? setInternalRole;
  const r = ROLES[activeRole];

  function selectRole(role: ContactRole) {
    setRole(role);
    trackEvent("Role Selected", { role });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-2">
      <div className="flex border-b border-line">
        {(Object.keys(ROLES) as ContactRole[]).map((key) => {
          const active = key === activeRole;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectRole(key)}
              className={`flex-1 border-b-2 px-3 py-4 font-mono text-[12.5px] tracking-wide transition-all duration-200 active:scale-[0.98] ${
                active ? `${ROLES[key].colorClass} bg-hover` : "border-transparent text-muted hover:bg-hover hover:text-text"
              }`}
            >
              {ROLES[key].label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3.5 p-9">
        <div className={`font-mono text-[11px] tracking-widest ${r.colorClass.split(" ")[1]}`}>{r.tag}</div>
        <h3 className="font-display text-2xl font-semibold">{r.title}</h3>
        <p className="max-w-xl text-sm leading-7 text-muted">{r.desc}</p>
        <a
          href={`mailto:${emails[activeRole]}`}
          className={`w-fit rounded-md px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${r.btnClass}`}
        >
          {emails[activeRole]}
        </a>
      </div>
    </div>
  );
}

export { ROLES };
