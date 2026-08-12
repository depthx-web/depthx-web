"use client";

import { useActionState } from "react";
import Link from "next/link";
import { subscribeNewsletterAction, type NewsletterActionState } from "@/app/actions/newsletter";
import { Reveal } from "@/components/ui/reveal";

const initialState: NewsletterActionState = { error: null };

export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);

  return (
    <section className="px-8 py-25 md:px-25">
      <Reveal className="overflow-hidden rounded-xl border border-line bg-gradient-to-br from-bg-2 to-bg-3 p-9 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="mb-2.5 font-mono text-xs tracking-widest text-amber">
              {"// STAY UPDATED"}
            </div>
            <h3 className="mb-2.5 font-display text-2xl font-semibold md:text-3xl">
              Get IP milestones in your inbox.
            </h3>
            <p className="text-sm leading-7 text-muted">
              Occasional updates on patent grants, new research, and licensing opportunities.
              No spam, unsubscribe any time.
            </p>
          </div>
          <div className="w-full max-w-sm">
            {state.success ? (
              <div
                role="status"
                className="rounded-md border border-green bg-green/10 p-4 text-sm leading-6"
              >
                <strong className="mb-1 block font-display text-[15px] text-green">
                  You&apos;re subscribed.
                </strong>
                Thanks for signing up — watch your inbox for updates.
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full flex-1 rounded-md border border-line bg-bg px-3.5 py-3 text-sm text-text transition-colors focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="shrink-0 rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97] disabled:opacity-60"
                  >
                    {pending ? "Subscribing…" : "Subscribe"}
                  </button>
                </div>
                <label className="flex items-start gap-2 text-xs leading-5 text-muted">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-green"
                  />
                  I agree to receive marketing emails from Depth X about IP milestones and
                  research updates. You can unsubscribe at any time — see our{" "}
                  <Link href="/legal/privacy-policy" className="underline hover:text-text">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </form>
            )}
            {state.error && (
              <p role="alert" className="mt-2.5 text-xs text-amber">
                {state.error}
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
