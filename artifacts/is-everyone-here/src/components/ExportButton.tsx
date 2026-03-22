import { useState, useRef, useEffect } from "react";
import { Download, Clipboard, FileText, Braces, Check } from "lucide-react";
import { Person } from "@/lib/state";
import { Translations } from "@/lib/i18n";
import { todayISO } from "@/lib/dateUtils";

interface Props {
  people: Person[];
  t: Translations;
  appName: string;
  eventDate?: string;
}

function buildRows(people: Person[]) {
  return people.map((p) => ({
    name: p.name,
    attended: p.status === "left" || p.status === "here",
    attendedLabel: p.status === "left" || p.status === "here" ? "TRUE" : "FALSE",
  }));
}

function buildFilename(appName: string, isoDate: string, ext: string): string {
  const base = appName
    .replace(/^[¿¡]+/, "")
    .replace(/[?？!！]$/, "")
    .trim();
  return `${base} ${isoDate}.${ext}`;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton({ people, t, appName, eventDate }: Props) {
  const co = t.checkout;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isoDate = eventDate ?? todayISO();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleClipboard() {
    const rows = buildRows(people);
    const header = `${co.exportColName}\t${isoDate}`;
    const body = rows.map((r) => `${r.name}\t${r.attendedLabel}`).join("\n");
    navigator.clipboard.writeText(`${header}\n${body}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    setOpen(false);
  }

  function handleClipboardValues() {
    const rows = buildRows(people);
    const body = rows.map((r) => r.attendedLabel).join("\n");
    navigator.clipboard.writeText(`${isoDate}\n${body}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    setOpen(false);
  }

  function handleCSV() {
    const rows = buildRows(people);
    const header = `${co.exportColName},${isoDate}`;
    const body = rows
      .map((r) => {
        const safeName = /[,"\n]/.test(r.name) ? `"${r.name.replace(/"/g, '""')}"` : r.name;
        return `${safeName},${r.attendedLabel}`;
      })
      .join("\n");
    downloadFile(
      `${header}\n${body}`,
      buildFilename(appName, isoDate, "csv"),
      "text/csv;charset=utf-8;"
    );
    setOpen(false);
  }

  function handleJSON() {
    const rows = buildRows(people);
    const data = {
      date: isoDate,
      attendance: rows.map((r) => ({ name: r.name, attended: r.attended })),
    };
    downloadFile(
      JSON.stringify(data, null, 2),
      buildFilename(appName, isoDate, "json"),
      "application/json"
    );
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-primary/50 dark:border-primary/40 text-primary dark:text-primary font-semibold text-sm hover:bg-primary/5 dark:hover:bg-zinc-700 transition-colors active:opacity-80"
      >
        {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        {copied ? co.exportCopied : co.export}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-20">
          <button
            onClick={handleClipboard}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
          >
            <Clipboard className="w-4 h-4 text-muted-foreground shrink-0" />
            {co.exportClipboard}
          </button>
          <button
            onClick={handleClipboardValues}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
          >
            <Clipboard className="w-4 h-4 text-muted-foreground shrink-0" />
            {co.exportClipboardValues}
          </button>
          <div className="border-t border-border" />
          <button
            onClick={handleCSV}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
            {co.exportCSV}
          </button>
          <button
            onClick={handleJSON}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
          >
            <Braces className="w-4 h-4 text-muted-foreground shrink-0" />
            {co.exportJSON}
          </button>
        </div>
      )}
    </div>
  );
}
