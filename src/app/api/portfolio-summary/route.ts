// Generates the one-page portfolio summary PDF on demand from live project
// data (title, domain, status, patent number, readiness) — replaces what was
// previously just a "Request PDF Summary" mailto link that produced no PDF.
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProjects, getSiteSettings } from "@/lib/content";
import { STATUS_LABEL } from "@/lib/project-display";

export async function GET() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  const pdf = await PDFDocument.create();
  pdf.setTitle("Depth X — Portfolio Summary");
  pdf.setAuthor("Depth X Ltd.");

  const page = pdf.addPage([595.28, 841.89]); // A4
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const margin = 48;
  const pageWidth = page.getWidth();
  const green = rgb(0.243, 0.839, 0.627);
  const dark = rgb(0.06, 0.09, 0.14);
  const muted = rgb(0.4, 0.45, 0.5);
  let y = page.getHeight() - margin;

  page.drawText("Depth X", { x: margin, y, size: 22, font: bold, color: dark });
  page.drawText("X", {
    x: margin + bold.widthOfTextAtSize("Depth ", 22),
    y,
    size: 22,
    font: bold,
    color: green,
  });
  y -= 18;
  page.drawText("Portfolio Summary — generated for internal review", {
    x: margin,
    y,
    size: 10,
    font: regular,
    color: muted,
  });
  y -= 12;
  page.drawText(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), {
    x: margin,
    y,
    size: 10,
    font: regular,
    color: muted,
  });
  y -= 28;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.87, 0.9),
  });
  y -= 24;

  const columns = [
    { label: "PROJECT", width: 170 },
    { label: "DOMAIN", width: 130 },
    { label: "STATUS", width: 90 },
    { label: "PATENT NO.", width: 90 },
    { label: "READINESS", width: 60 },
  ];
  let x = margin;
  for (const col of columns) {
    page.drawText(col.label, { x, y, size: 8, font: bold, color: muted });
    x += col.width;
  }
  y -= 16;

  for (const project of projects) {
    if (y < margin + 60) break; // one-pager by design; overflow is a known limit
    x = margin;
    const cells = [
      project.title,
      project.researchDomain.name,
      STATUS_LABEL[project.status],
      project.patentNumber ?? "—",
      `${project.readinessStage}/3`,
    ];
    cells.forEach((text, i) => {
      const col = columns[i];
      const truncated = truncateToWidth(text, regular, 9, col.width - 8);
      page.drawText(truncated, { x, y, size: 9, font: regular, color: dark });
      x += col.width;
    });
    y -= 20;
  }

  y -= 12;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.87, 0.9),
  });
  y -= 20;
  page.drawText("Depth X Ltd. — Registered in England & Wales, Company No. 16162223", {
    x: margin,
    y,
    size: 8,
    font: regular,
    color: muted,
  });
  y -= 12;
  page.drawText(`Questions about licensing terms: ${settings.contactEmails.investor || "office@depthx.co.uk"}`, {
    x: margin,
    y,
    size: 8,
    font: regular,
    color: muted,
  });

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="depthx-portfolio-summary.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

function truncateToWidth(text: string, font: import("pdf-lib").PDFFont, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && font.widthOfTextAtSize(`${truncated}…`, size) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}
