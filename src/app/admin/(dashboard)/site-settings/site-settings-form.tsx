"use client";

import { useActionState } from "react";
import {
  updateSiteSettingsAction,
  type SiteSettingsActionState,
} from "@/app/admin/actions/site-settings";
import { SECTION_GROUPS } from "@/lib/section-visibility";
import type { Database } from "@/lib/supabase/database.types";

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

const initialState: SiteSettingsActionState = { error: null };

const inputClass =
  "w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue";

export function SiteSettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction, pending] = useActionState(updateSiteSettingsAction, initialState);
  const stats = settings.stats ?? [];
  const trustBarLogos = settings.trust_bar_logos ?? [];

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8">
      <Section title="Branding">
        <TextField
          name="logo_url"
          label="Site Logo URL"
          defaultValue={settings.logo_url ?? ""}
        />
        <p className="text-xs text-muted">
          Shown in the nav bar and footer in place of the &quot;DepthX&quot; text wordmark. Leave
          empty to keep the text version.
        </p>
      </Section>

      <Section title="Hero">
        <TextField name="hero_headline" label="Hero Headline" defaultValue={settings.hero_headline} />
        <TextField
          name="hero_headline_accent"
          label="Hero Headline (accent line)"
          defaultValue={settings.hero_headline_accent}
        />
        <TextAreaField name="hero_subtext" label="Hero Subtext" defaultValue={settings.hero_subtext} />
      </Section>

      <Section title="Stats (home + investors + IP pages)">
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <input
                name={`stat_${i + 1}_label`}
                defaultValue={stats[i]?.label ?? ""}
                placeholder="Label"
                className={inputClass}
              />
              <input
                name={`stat_${i + 1}_value`}
                defaultValue={stats[i]?.value ?? ""}
                placeholder="Value"
                className={`${inputClass} w-24`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Trust Bar Logos">
        <p className="text-xs text-muted">
          Shown in the homepage &quot;Validated With&quot; strip. Add a logo image URL to show the
          actual logo instead of a text badge with the name.
        </p>
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                name={`trust_bar_logo_${i + 1}_name`}
                defaultValue={trustBarLogos[i]?.name ?? ""}
                placeholder="Name"
                className={inputClass}
              />
              <input
                name={`trust_bar_logo_${i + 1}_url`}
                defaultValue={trustBarLogos[i]?.logoUrl ?? ""}
                placeholder="Logo image URL (optional)"
                className={`${inputClass} sm:col-span-2`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Footer & Contact">
        <TextAreaField name="footer_text" label="Footer Text" defaultValue={settings.footer_text} />
        <TextField
          name="contact_email_investor"
          label="Investor Email"
          defaultValue={settings.contact_email_investor}
        />
        <TextField
          name="contact_email_researcher"
          label="Researcher Email"
          defaultValue={settings.contact_email_researcher}
        />
        <TextField
          name="contact_email_company"
          label="Company Email"
          defaultValue={settings.contact_email_company}
        />
      </Section>

      <Section title="Section Visibility">
        <p className="mb-2 text-xs text-muted">
          Uncheck a section to hide it from the public site. Every visible section on every page
          can be turned off here.
        </p>
        <div className="flex flex-col gap-6">
          {SECTION_GROUPS.map((group) => (
            <div key={group.page}>
              <h3 className="mb-2.5 font-mono text-[11px] tracking-widest text-amber">
                {group.page.toUpperCase()}
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {group.keys.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      name={`section_${key}`}
                      defaultChecked={settings.section_visibility?.[key] !== false}
                      className="h-4 w-4 accent-green"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {state.success && (
        <p role="status" className="rounded-md border border-green bg-green/10 px-4 py-3 text-sm text-green">
          Settings saved successfully.
        </p>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-bg-2 p-6">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] tracking-wide text-muted">{label.toUpperCase()}</span>
      <input name={name} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] tracking-wide text-muted">{label.toUpperCase()}</span>
      <textarea name={name} rows={3} defaultValue={defaultValue} className={`${inputClass} resize-y`} />
    </label>
  );
}
