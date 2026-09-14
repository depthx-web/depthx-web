"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Value = string | string[] | boolean;
type Interview = Record<string, Value> & {
  databaseId?: string;
  id?: string;
  createdAt?: string;
  submissionRole?: string;
  syncStatus?: string;
  responses?: Record<string, unknown>;
};
type Segment = "all" | "E" | "O" | "A" | "V";

type Filters = {
  segment: Segment;
  exhibition: string;
  language: string;
  followUp: string;
  pilot: string;
  search: string;
};

const initialFilters: Filters = { segment: "all", exhibition: "all", language: "all", followUp: "all", pilot: "all", search: "" };
const professionalSegments = ["E", "O", "A"] as const;
const segmentLabels: Record<string, string> = { E: "Exhibitors", O: "Organizers", A: "Agencies", V: "Visitors" };
const concernKeys = ["safety", "regulation_approvals", "aviation_regulatory_approval", "venue_approval", "noise", "privacy", "cost", "technical_reliability", "audience_acceptance", "weather", "insurance_liability", "client_acceptance", "no_major_concern"];
const valueKeys = ["mobile_aerial_advertising", "audience_attention_measurement", "real_time_analytics", "adaptive_campaign_content", "multi_uav_operation", "near_continuous_operation", "qr_interactive_engagement", "campaign_reporting", "new_advertising_format", "exhibitor_analytics", "visitor_engagement", "adaptive_advertising", "audience_analytics", "real_time_measurement", "adaptive_campaigns", "interactive_engagement", "client_reporting"];

function text(value: Value | unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === null || value === undefined ? "" : String(value);
}

function arrayValue(value: Value | unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function score(value: Value | unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 && number <= 5 ? number : null;
}

function average(items: Interview[], key: string): string {
  const values = items.map((item) => score(item[key])).filter((value): value is number => value !== null);
  return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : "—";
}

function countStrongLeads(items: Interview[]): number {
  return items.filter((item) => professionalSegments.includes(text(item.type) as (typeof professionalSegments)[number]) && (score(item.pilotPotential) ?? 0) >= 4 && (text(item.followUp) === "Yes" || Boolean(item.contactConsent))).length;
}

function importanceScore(item: Interview): number | null {
  const type = text(item.type);
  const key = type === "E" ? "e5_data_importance" : type === "O" ? "o5_measurement_importance" : type === "A" ? "a5_measurement_importance" : "problemImportance";
  return score(item[key]);
}

function countSelections(items: Interview[], keys: string[]): { key: string; count: number; percent: number }[] {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    keys.forEach((key) => arrayValue(item[key]).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1)));
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count, percent: items.length ? Math.round((count / items.length) * 100) : 0 }));
}

function BarList({ items, empty = "Insufficient evidence" }: { items: { key: string; count: number; percent: number }[]; empty?: string }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return <div className="space-y-3">{items.slice(0, 10).map((item) => <div key={item.key}><div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-muted">{item.key.replaceAll("_", " ")}</span><span className="shrink-0 text-text">{item.count} · {item.percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-green" style={{ width: `${Math.max(item.percent, item.count ? 3 : 0)}%` }} /></div></div>)}</div>;
}

function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <div className="rounded-xl border border-line bg-bg-2 p-4"><div className="font-display text-2xl font-bold text-green">{value}</div><div className="mt-1 text-xs font-mono uppercase tracking-wide text-muted">{label}</div>{hint && <div className="mt-2 text-xs text-muted">{hint}</div>}</div>;
}

export function AdminInterviewDashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selected, setSelected] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customer-discovery")
      .then(async (response) => { if (!response.ok) throw new Error("Unable to load interview data."); return response.json() as Promise<Interview[]>; })
      .then(setInterviews)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load interview data."))
      .finally(() => setLoading(false));
  }, []);

  const exhibitions = useMemo(() => ["all", ...new Set(interviews.map((item) => text(item.exhibition)).filter(Boolean))], [interviews]);
  const languages = useMemo(() => ["all", ...new Set(interviews.map((item) => text(item.questionLanguage) || "en"))], [interviews]);
  const filtered = useMemo(() => interviews.filter((item) => {
    const segment = text(item.type);
    const search = filters.search.toLowerCase();
    return (filters.segment === "all" || segment === filters.segment) &&
      (filters.exhibition === "all" || text(item.exhibition) === filters.exhibition) &&
      (filters.language === "all" || (text(item.questionLanguage) || "en") === filters.language) &&
      (filters.followUp === "all" || text(item.followUp) === filters.followUp) &&
      (filters.pilot === "all" || String(score(item.pilotPotential) ?? "") === filters.pilot) &&
      (!search || [item.id, item.company, item.exhibition, item.keyInsight, item.biggestObjection].some((value) => text(value).toLowerCase().includes(search)));
  }), [filters, interviews]);

  const professionals = filtered.filter((item) => professionalSegments.includes(text(item.type) as (typeof professionalSegments)[number]));
  const visitors = filtered.filter((item) => text(item.type) === "V");
  const strongInterest = professionals.filter((item) => (score(item.conceptInterest) ?? 0) >= 4);
  const strongPilot = professionals.filter((item) => (score(item.pilotPotential) ?? 0) >= 4);
  const followUp = professionals.filter((item) => text(item.followUp) === "Yes" || Boolean(item.contactConsent));
  const filteredUserRecords = filtered.filter((item) => text(item.submissionRole) !== "admin");
  const concernItems = countSelections(professionals, concernKeys);
  const valueItems = countSelections(professionals, valueKeys);
  const problemItems = countSelections(professionals, ["digital_screens", "printed_banners", "product_demonstrations", "promotional_staff", "foot_traffic", "leads_collected", "qr_scans", "not_measured", "noticed_campaign_count", "attention_duration"]);

  const segmentRows = professionalSegments.map((segment) => {
    const rows = filtered.filter((item) => text(item.type) === segment);
    return { segment, rows, leads: countStrongLeads(rows) };
  });

  const updateFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  if (loading) return <div className="rounded-xl border border-line bg-bg-2 p-6 text-sm text-muted">Loading interview evidence…</div>;
  if (error) return <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-6 text-sm text-red-300">{error}</div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-amber">DECISION DASHBOARD</p><h1 className="mt-2 font-display text-3xl font-semibold">Customer discovery evidence</h1><p className="mt-2 max-w-3xl text-sm text-muted">Founder-level view of problem evidence, solution pull, pilot readiness, and critical risks. Visitors remain separate from buyer evidence.</p></div><Link href="/interview" className="rounded-md bg-green px-4 py-2 text-sm font-semibold text-[#06140F]">Open interview form</Link></div>

    <section className="rounded-xl border border-line bg-bg-2 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold">Filters</h2><button type="button" onClick={() => setFilters(initialFilters)} className="rounded-md border border-line px-3 py-1.5 text-xs text-muted hover:text-text">Reset filters</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><label className="text-xs text-muted">Segment<select value={filters.segment} onChange={(event) => updateFilter("segment", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text"><option value="all">All</option>{Object.entries(segmentLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="text-xs text-muted">Exhibition<select value={filters.exhibition} onChange={(event) => updateFilter("exhibition", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text">{exhibitions.map((value) => <option key={value} value={value}>{value === "all" ? "All" : value}</option>)}</select></label><label className="text-xs text-muted">Language<select value={filters.language} onChange={(event) => updateFilter("language", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text">{languages.map((value) => <option key={value} value={value}>{value === "all" ? "All" : value}</option>)}</select></label><label className="text-xs text-muted">Follow-up<select value={filters.followUp} onChange={(event) => updateFilter("followUp", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text"><option value="all">All</option><option value="Yes">Yes</option><option value="Maybe">Maybe</option><option value="No">No</option></select></label><label className="text-xs text-muted">Pilot potential<select value={filters.pilot} onChange={(event) => updateFilter("pilot", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text"><option value="all">All</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="text-xs text-muted sm:col-span-2 lg:col-span-1">Search<input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Company, insight…" className="mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-text" /></label></div></section>

    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Executive KPIs</h2><span className="text-xs text-muted">{filtered.length} filtered of {interviews.length}</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"><Kpi label="Total interviews" value={filtered.length} /><Kpi label="Professional" value={professionals.length} /><Kpi label="Visitors" value={visitors.length} /><Kpi label="Avg measurement pain" value={average(professionals, "measurementPain")} /><Kpi label="Avg concept interest" value={average(professionals, "conceptInterest")} /><Kpi label="Avg pilot potential" value={average(professionals, "pilotPotential")} /><Kpi label="Follow-up approvals" value={followUp.length} /><Kpi label="Strong pilot leads" value={countStrongLeads(filtered)} hint="Professional + pilot potential ≥4 + follow-up/contact permission" />{["E", "O", "A"].map((segment) => <Kpi key={segment} label={segmentLabels[segment]} value={filtered.filter((item) => text(item.type) === segment).length} />)}</div></section>

    <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Professional segment comparison</h2><div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-muted"><tr><th className="pb-3 pr-5">Segment</th><th className="pb-3 pr-5">Interviews</th><th className="pb-3 pr-5">Pain</th><th className="pb-3 pr-5">Interest</th><th className="pb-3 pr-5">Pilot</th><th className="pb-3 pr-5">Follow-up</th><th className="pb-3">Leads</th></tr></thead><tbody>{segmentRows.map(({ segment, rows, leads }) => <tr key={segment} className="border-t border-line"><td className="py-3 pr-5 font-semibold">{segmentLabels[segment]}</td><td className="py-3 pr-5">{rows.length}</td><td className="py-3 pr-5">{average(rows, "measurementPain")}</td><td className="py-3 pr-5">{average(rows, "conceptInterest")}</td><td className="py-3 pr-5">{average(rows, "pilotPotential")}</td><td className="py-3 pr-5">{rows.filter((item) => text(item.followUp) === "Yes" || Boolean(item.contactConsent)).length}</td><td className="py-3">{leads}</td></tr>)}</tbody></table></div></div><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Founder decision view</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Kpi label="Problem evidence" value={professionals.length ? `${professionals.filter((item) => (importanceScore(item) ?? 0) >= 4).length}/${professionals.length}` : "Insufficient evidence"} hint="Measurement importance ≥4" /><Kpi label="Solution pull" value={strongInterest.length ? `${strongInterest.length}/${professionals.length}` : "Insufficient evidence"} hint="Concept interest ≥4" /><Kpi label="Pilot evidence" value={strongPilot.length ? `${strongPilot.length}/${professionals.length}` : "Insufficient evidence"} hint="Pilot potential ≥4" /><Kpi label="Critical risk" value={concernItems.length ? concernItems[0].key.replaceAll("_", " ") : "Insufficient evidence"} hint={concernItems.length ? `${concernItems[0].count}/${professionals.length} selections` : undefined} /></div></div></section>

    <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Problem evidence</h2><p className="mt-1 text-sm text-muted">Pre-concept methods, measurement, and missing evidence from E/O/A.</p><div className="mt-5"><BarList items={problemItems} /></div></div><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Solution pull</h2><p className="mt-1 text-sm text-muted">Post-concept selections from professional respondents.</p><div className="mt-5"><BarList items={valueItems} /></div></div></section>

    <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Pilot readiness</h2><div className="mt-4 grid grid-cols-2 gap-3"><Kpi label="Strong concept" value={strongInterest.length} /><Kpi label="Strong pilot" value={strongPilot.length} /><Kpi label="Follow-up allowed" value={followUp.length} /><Kpi label="Qualified leads" value={countStrongLeads(filtered)} /></div><div className="mt-5 space-y-2 text-sm text-muted"><div>Professional interviews <span className="float-right text-text">{professionals.length}</span></div><div>→ Strong concept interest <span className="float-right text-text">{strongInterest.length}</span></div><div>→ Strong pilot potential <span className="float-right text-text">{strongPilot.length}</span></div><div>→ Follow-up allowed <span className="float-right text-text">{followUp.length}</span></div><div>→ Qualified pilot leads <span className="float-right font-semibold text-green">{countStrongLeads(filtered)}</span></div></div></div><div className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Risks & objections</h2><p className="mt-1 text-sm text-muted">Professional evidence only; visitors are excluded.</p><div className="mt-5"><BarList items={concernItems} /></div></div></section>

    <section className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Audience Acceptance Evidence</h2><p className="mt-1 text-sm text-muted">Visitor responses are separated from buyer, customer, and pilot-readiness metrics.</p><div className="mt-5 grid gap-5 lg:grid-cols-2"><BarList items={countSelections(visitors, ["screens", "moving_displays", "lighting", "sound", "people_presenters", "product_demonstrations", "interactive_experiences", "unusual_technology", "giveaways", "other"])} /><BarList items={countSelections(visitors, ["safety", "noise", "privacy", "flying_close_to_people", "uav_size", "unexpected_movement", "cameras_sensors", "crowded_environment", "no_major_concern", "other"])} /></div></section>

    <section className="rounded-xl border border-line bg-bg-2 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold">Interview Explorer</h2><p className="mt-1 text-sm text-muted">Open any record to inspect every stored answer and the raw response payload.</p></div><span className="text-xs text-muted">{filteredUserRecords.length} user records in current view</span></div><div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-muted"><tr><th className="pb-3 pr-5">ID</th><th className="pb-3 pr-5">Segment</th><th className="pb-3 pr-5">Company</th><th className="pb-3 pr-5">Exhibition</th><th className="pb-3 pr-5">Date</th><th className="pb-3">Open</th></tr></thead><tbody>{filtered.map((item) => <tr key={`${item.databaseId}-${item.createdAt}`} className="border-t border-line"><td className="py-3 pr-5">{text(item.id) || "—"}</td><td className="py-3 pr-5">{segmentLabels[text(item.type)] || text(item.type) || "—"}</td><td className="py-3 pr-5">{text(item.company) || "—"}</td><td className="py-3 pr-5">{text(item.exhibition) || "—"}</td><td className="py-3 pr-5">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td><td className="py-3"><button type="button" onClick={() => setSelected(item)} className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-green hover:text-green">View</button></td></tr>)}</tbody></table></div></section>

    <section className="rounded-xl border border-line bg-bg-2 p-5"><h2 className="font-display text-xl font-semibold">Qualitative evidence & data quality</h2><div className="mt-4 grid gap-5 lg:grid-cols-2"><div><h3 className="font-semibold">Insights and objections</h3><div className="mt-3 space-y-3">{filtered.flatMap((item) => [text(item.keyInsight) && `Insight: ${text(item.keyInsight)}`, text(item.biggestObjection) && `Objection: ${text(item.biggestObjection)}`, text(item.nextAction) && `Next: ${text(item.nextAction)}`]).filter(Boolean).slice(0, 12).map((value, index) => <p key={`${value}-${index}`} className="rounded-lg border border-line bg-bg p-3 text-sm text-muted">{value}</p>)}{!filtered.some((item) => text(item.keyInsight) || text(item.biggestObjection)) && <p className="text-sm text-muted">Insufficient evidence</p>}</div></div><div><h3 className="font-semibold">Data quality</h3><div className="mt-3 space-y-2 text-sm text-muted"><p>Missing category: <span className="float-right text-text">{filtered.filter((item) => !text(item.type)).length}</span></p><p>Missing interviewer scores: <span className="float-right text-text">{filtered.filter((item) => score(item.measurementPain) === null || score(item.conceptInterest) === null || score(item.pilotPotential) === null).length}</span></p><p>Pending sync: <span className="float-right text-text">{filtered.filter((item) => text(item.syncStatus) === "pending").length}</span></p><p>Follow-up without contact: <span className="float-right text-text">{filtered.filter((item) => text(item.followUp) === "Yes" && !text(item.contact)).length}</span></p></div></div></div></section>

    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-line bg-bg p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="flex items-start justify-between border-b border-line pb-4"><div><p className="font-mono text-xs uppercase text-muted">Complete interview record</p><h3 className="mt-1 font-display text-2xl font-semibold">{text(selected.id)}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-md border border-line px-3 py-1.5 text-sm text-muted">Close</button></div><dl className="mt-5 grid gap-4 sm:grid-cols-2">{Object.entries(selected).filter(([key]) => key !== "responses").map(([key, value]) => <div key={key} className="rounded-lg border border-line bg-bg-2 p-3"><dt className="font-mono text-[11px] uppercase text-muted">{key}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{text(value)}</dd></div>)}</dl>{selected.responses && <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-bg-2 p-4 text-xs leading-6">{JSON.stringify(selected.responses, null, 2)}</pre>}</div></div>}
  </div>;
}