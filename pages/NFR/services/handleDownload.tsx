import { marked } from "marked";
import html2pdf from "html2pdf.js";
import { nfrService } from "./nfrService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DownloadOptions {
  id: number;
  applicationName: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

// ─── PDF Styles ───────────────────────────────────────────────────────────────

const PDF_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .pdf-header .title,
.pdf-header .meta {
  line-height: 1.4;
}

.pdf-header {
  overflow: visible !important;
}

  body, .content {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 13px;
    line-height: 1.75;
    color: #1a1a2e;
    background: #ffffff;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  /* ── Header banner ── */
  .pdf-header {
  display: table;
  width: 100%;
  padding: 15px 28px;
  background: linear-gradient(135deg, #062469ff 0%, #084ca3ff 100%);
  border-radius: 8px 8px 0 0;
  margin-bottom: 28px;
}

.pdf-header .title {
  display: table-cell;
  vertical-align: middle;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 28px;
}

.pdf-header .meta {
  display: table-cell;
  vertical-align: middle;
  text-align: right;
  font-size: 11px;
  color: #94a3b8;
}


  /* ── Typography ── */
  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    margin: 28px 0 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
    page-break-after: avoid;
    letter-spacing: -0.3px;
  }

  h2 {
    font-size: 17px;
    font-weight: 600;
    color: #1e3a5f;
    margin: 22px 0 10px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin: 18px 0 8px;
    page-break-after: avoid;
  }

  p {
    margin: 10px 0;
    page-break-inside: avoid;
  }

  /* ── Lists ── */
  ul, ol {
    padding-left: 20px;
    margin: 10px 0;
    page-break-inside: avoid;
  }

  li {
    margin: 5px 0;
    page-break-inside: avoid;
  }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 12px;
    page-break-inside: avoid;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
    padding: 9px 12px;
    border: 1px solid #e2e8f0;
    text-align: left;
    letter-spacing: 0.2px;
  }

  td {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* ── Code ── */
  code {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 12px;
    background: #f1f5f9;
    color: #be185d;
    padding: 2px 6px;
    border-radius: 4px;
  }

  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 14px 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 14px 0;
    font-size: 12px;
    line-height: 1.6;
    page-break-inside: avoid;
  }

  pre code {
    background: none;
    color: inherit;
    padding: 0;
  }

  /* ── Blockquotes ── */
  blockquote {
    border-left: 4px solid #3b82f6;
    background: #eff6ff;
    padding: 10px 16px;
    margin: 14px 0;
    border-radius: 0 6px 6px 0;
    color: #1e40af;
    font-style: italic;
    page-break-inside: avoid;
  }

  /* ── Dividers ── */
  .hr-wrapper {
    margin: 24px 0;
    page-break-inside: avoid;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
  }

  /* ── Links ── */
  a {
    color: #2563eb;
    text-decoration: underline;
  }

  /* ── Badges / strong ── */
  strong {
    font-weight: 600;
    color: #2d3549ff;
  }

  em {
    color: #475569;
  }

  /* ── Footer ── */
  .pdf-footer {
  display: table;
  width: 100%;
  margin-top: 40px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
  font-size: 10px;
  color: #94a3b8;
}

.pdf-footer span {
  display: table-cell;
  vertical-align: middle;
}

.pdf-footer span:last-child {
  text-align: right;
}

.pdf-footer {
  margin-bottom: 20px; /* 👈 critical */
}

.pdf-footer {
  page-break-inside: avoid;
  break-inside: avoid;
  overflow: visible !important;
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPdfDocument(html: string, applicationName: string, id: string | number): HTMLElement {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <style>${PDF_STYLES}</style>

    <div class="pdf-header">
      <span class="title">NFR Report — ${applicationName}</span>
      <span class="meta">ID: ${id}<br/>${dateStr}</span>
    </div>

    <div class="content">
      ${html}
    </div>

    <div class="pdf-footer">
      <span>NFR-${applicationName}-${id}.pdf</span>
      <span>Generated ${dateStr}</span>
    </div>
  `;

  return wrapper;
}

function sanitizeHtml(html: string): string {
  return html
    // Wrap <hr> in a spacing div to prevent page-break artefacts
    .replace(/<hr\s*\/?>/gi, `
      <div class="hr-wrapper"><hr /></div>
    `)
    // Ensure images don't overflow
    .replace(/<img /gi, `<img style="max-width:100%;height:auto;" `);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export const handleDownload = async ({
  id,
  applicationName,
  onStart,
  onSuccess,
  onError,
}: DownloadOptions): Promise<void> => {
  try {
    onStart?.();

    // 1. Fetch markdown content
    const blob = await nfrService.downloadById(id);
    const markdown = await blob.text();

    if (!markdown?.trim()) {
      throw new Error("Downloaded file is empty.");
    }

    // 2. Convert Markdown → HTML
    const rawHtml = await Promise.resolve(marked.parse(markdown));
    const html = sanitizeHtml(rawHtml);

    // 3. Build styled PDF document
    const element = buildPdfDocument(html, applicationName, id);

    // 4. Export to PDF
    await html2pdf()
      .from(element)
      .set({
        margin:   [15, 15, 15, 15],
        filename: `NFR-${applicationName}-${id}.pdf`,
        html2canvas: {
          scale:       2,
          useCORS:     true,
          letterRendering: true,
          scrollY: 0, 
          windowHeight: document.body.scrollHeight,
        },
        jsPDF: {
          unit:        "mm",
          format:      "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      } as any)
      .save();

    onSuccess?.();

  } catch (err) {
    console.error("[handleDownload]", err);
    onError?.(err);
  }
};