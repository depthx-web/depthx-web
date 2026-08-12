"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/investors", label: "For Investors" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/collaboration", label: "Collaboration" },
];

const SECONDARY_LINKS = [
  { href: "/ip-patents", label: "IP & Patents", key: null },
  { href: "/publications", label: "Publications", key: null },
  { href: "/team", label: "Team", key: "global.teamInNav" as const },
  { href: "/news", label: "News", key: "global.newsInNav" as const },
];

export function Nav({
  sectionVisibility,
}: {
  sectionVisibility: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a, button"),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const secondaryVisible = SECONDARY_LINKS.filter(
    (l) => !l.key || sectionVisibility[l.key] !== false,
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-100 flex items-center justify-between border-b px-8 py-4.5 backdrop-blur-md transition-colors ${
          scrolled ? "border-line bg-bg/80" : "border-transparent bg-bg/80"
        }`}
      >
        <Link href="/" className="font-display text-lg font-bold tracking-wide">
          Depth<span className="text-amber">X</span>
        </Link>

        <div className="hidden gap-7.5 text-[13.5px] text-muted lg:flex">
          {PRIMARY_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-text/50 after:transition-all after:duration-200 after:content-[''] hover:text-text hover:after:w-full ${
                  active ? "text-text" : "after:w-0"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-green" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.96] sm:inline-flex"
          >
            Contact
          </Link>
          <button
            ref={burgerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-1 border-none bg-transparent p-1.5 lg:hidden"
          >
            <span className="h-0.5 w-5 bg-text" />
            <span className="h-0.5 w-5 bg-text" />
            <span className="h-0.5 w-5 bg-text" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-200 flex-col gap-1.5 bg-bg px-8 pt-25 ${
          mobileOpen ? "flex" : "hidden"
        }`}
      >
        <div className="absolute top-6 right-8 flex items-center gap-3">
          <ThemeToggle />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="border-none bg-transparent text-2xl text-text"
          >
            ×
          </button>
        </div>
        {[...PRIMARY_LINKS, { href: "/contact", label: "Contact" }].map(
          (link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-line py-3.5 font-display text-2xl"
            >
              {link.label}
            </Link>
          ),
        )}
        {secondaryVisible.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="border-b border-line py-3.5 text-base opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
