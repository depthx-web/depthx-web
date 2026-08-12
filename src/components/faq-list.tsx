"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";

export function FaqList({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col border-t border-line">
      {items.map((item) => {
        const open = openId === item._id;
        return (
          <div
            key={item._id}
            className="border-b border-line px-2 transition-colors hover:bg-hover"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item._id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-5 py-5.5 text-left font-display text-[15.5px] font-semibold"
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 font-mono text-lg text-green transition-transform duration-200 ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300"
              style={{ maxHeight: open ? 200 : 0 }}
            >
              <p className="max-w-xl pb-5.5 text-sm leading-7 text-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
