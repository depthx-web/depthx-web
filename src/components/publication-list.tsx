"use client";

import { useState } from "react";
import type { Publication } from "@/lib/types";

export function PublicationList({ publications }: { publications: Publication[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {publications.map((pub) => {
        const open = openId === pub._id;
        return (
          <div
            key={pub._id}
            className="border-b border-line px-2 py-6.5 transition-colors hover:bg-hover"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <h4 className="mb-2 max-w-xl font-display text-[17px] font-semibold">
                  {pub.title}
                </h4>
                <div className="font-mono text-[11px] tracking-wide text-muted">
                  {pub.venue.toUpperCase()} · {pub.year}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : pub._id)}
                aria-expanded={open}
                className="whitespace-nowrap font-mono text-xs text-blue transition-transform duration-150 hover:text-text active:scale-95"
              >
                {open ? "Hide Abstract ↑" : "View Abstract →"}
              </button>
            </div>
            {open && (
              <p className="max-w-2xl pt-4 text-sm leading-7 text-muted">{pub.abstract}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
