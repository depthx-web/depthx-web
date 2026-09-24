// Generates the portfolio summary PDF on demand from live project data.
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProjects, getSiteSettings } from "@/lib/content";
import { commercialStatusLabel, developmentStageLabel, ipStatusLabel } from "@/lib/project-status";

export async function GET() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  const pdf = await PDFDocument.create();
  pdf.setTitle("Depth X — Portfolio Summary");
  pdf.setAuthor("Depth X Ltd.");

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const margin = 48;
  const green = rgb(0.243, 0.839, 0.627);
  const dark = rgb(0.06, 0.09, 0.14);
  const muted = rgb(0.4, 0.45, 0.5);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = drawHeader(page, margin, bold, regular, dark, muted, green);

  for (const project of projects) {
    const lines = [
      `${project.title} | ${project.researchDomain.name}`,
      `Development: ${developmentStageLabel(project.developmentStage)}    IP: ${ipStatusLabel(project.ipStatus)}`,
      `Commercial: ${commercialStatusLabel(project.commercialStatus)}    Next milestone: ${project.nextMilestone ?? "—"}`,
      `Summary: ${project.shortDescription}`,
      `Overview: ${project.overview}`,
    ];
    const wrapped = lines.flatMap((line, index) =>
      wrapText(line, regular, index === 0 ? 12 : 9, pageWidth - margin * 2),
    );
    const requiredHeight = wrapped.length * 14 + 22;

    if (y - requiredHeight < margin + 36) {
      drawFooter(page, margin, regular, muted, settings.contactEmails.investor || "office@depthx.co.uk");
      page = pdf.addPage([pageWidth, pageHeight]);
      y = drawHeader(page, margin, bold, regular, dark, muted, green);
    }

    wrapped.forEach((line, index) => {
      const isTitle = index === 0;
      page.drawText(line, {
        x: margin,
        y,
        size: isTitle ? 12 : 9,
        font: isTitle ? bold : regular,
        color: isTitle ? dark : muted,
      });
      y -= isTitle ? 18 : 14;
    });
    y -= 8;
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.6,
      color: rgb(0.85, 0.87, 0.9),
    });
    y -= 16;
  }

  drawFooter(page, margin, regular, muted, settings.contactEmails.investor || "office@depthx.co.uk");

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="depthx-portfolio-summary.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

function wrapText(text: string, font: import("pdf-lib").PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawHeader(
  page: import("pdf-lib").PDFPage,
  margin: number,
  bold: import("pdf-lib").PDFFont,
  regular: import("pdf-lib").PDFFont,
  dark: ReturnType<typeof rgb>,
  muted: ReturnType<typeof rgb>,
  green: ReturnType<typeof rgb>,
): number {
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
  page.drawText("Portfolio Summary — full project details", {
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
    end: { x: page.getWidth() - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.87, 0.9),
  });
  return y - 24;
}

function drawFooter(
  page: import("pdf-lib").PDFPage,
  margin: number,
  regular: import("pdf-lib").PDFFont,
  muted: ReturnType<typeof rgb>,
  contactEmail: string,
): void {
  const y = margin;
  page.drawText("Depth X Ltd. — Registered in England & Wales, Company No. 16162223", {
    x: margin,
    y,
    size: 8,
    font: regular,
    color: muted,
  });
  page.drawText(`Questions about licensing terms: ${contactEmail}`, {
    x: margin,
    y: y - 12,
    size: 8,
    font: regular,
    color: muted,
  });
}
