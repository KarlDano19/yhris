"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SalaryHistoryEntry } from "./SalaryHistoryModal";
import TrendChart, { TrendPoint } from "../../common/TrendChart";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { notify } from "../../utils/notify"; // 👈 add toast helper

type HrNote = { id: string; text: string; createdAt: Date };

export default function SalaryHistoryAnalysis({
  employeeName,
  currentSalary,
  lastAdjustmentAmount,
  daysBetweenChanges,
  entries,
  onExportPdf,
  onAddNote,
  onDeleteNote,
}: {
  employeeName: string;
  currentSalary: number;
  lastAdjustmentAmount: number;
  daysBetweenChanges: number;
  entries: SalaryHistoryEntry[];
  onExportPdf?: () => void;
  onAddNote?: (text: string) => void;
  onDeleteNote?: (id: string) => void;
}) {
  const points: TrendPoint[] = entries?.length
    ? entries.map((e) => ({ x: new Date(e.effectiveDate).getTime(), y: e.salary }))
    : [];

  const pct =
    entries.length >= 2 && entries[entries.length - 2].salary !== 0
      ? (lastAdjustmentAmount / entries[entries.length - 2].salary) * 100
      : 0;

  const [notes, setNotes] = useState<HrNote[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startAddNote = () => {
    setIsWriting(true);
    setDraft("");
  };
  const cancelAddNote = () => {
    setIsWriting(false);
    setDraft("");
  };
  const saveNote = () => {
    const text = draft.trim();
    if (!text) return;
    const newNote: HrNote = { id: cryptoRandomId(), text, createdAt: new Date() };
    setNotes((prev) => [newNote, ...prev]);
    setIsWriting(false);
    setDraft("");
    onAddNote?.(text);
    notify.success("Note added."); // 👈 toast
  };

  const handleDeleteNote = async (id: string) => {
    setDeletingId(id);
    try {
      const ok = await notify.promise(
        (async () => {
          // mimic latency or call your API here
          await sleep(800);
          await onDeleteNote?.(id);
          setNotes((prev) => prev.filter((n) => n.id !== id)); // remove only on success
        })(),
        {
          loading: "Deleting note…",
          success: "Note deleted.",
          error: "Failed to delete note.",
        }
      );
      // ok returns true/false; state changes already handled above when resolved
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- EXPORT TO PDF ---------- */
  const captureRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    if (onExportPdf) return onExportPdf();

    const node = captureRef.current;
    if (!node) return;

    await notify.promise(
      (async () => {
        const canvas = await html2canvas(node, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          onclone: (doc) => {
            const root = doc.getElementById("salary-analysis-capture");
            if (!root) return;
            root.setAttribute("data-export", "true");
            root.querySelectorAll(".sticky").forEach((el) => {
              (el as HTMLElement).style.position = "static";
              (el as HTMLElement).style.top = "auto";
            });
            const grid = root.querySelector(".tile-grid") as HTMLElement | null;
            if (grid) {
              grid.style.display = "grid";
              grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
              grid.style.gap = "12px";
            }
            const style = doc.createElement("style");
            style.textContent = `
              [data-export] .no-print { display: none !important; }
              [data-export] .export-only { display: block !important; }
              [data-export] .card { border-color: #ffffffff !important; }
            `;
            doc.head.appendChild(style);
          },
        });

        const pdf = new jsPDF({ unit: "pt", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 24;

        const imgW = pageW - margin * 2;
        const ratio = canvas.width / imgW;
        const sliceH = (pageH - margin * 2) * ratio;

        const pageCanvas = document.createElement("canvas");
        const ctx = pageCanvas.getContext("2d")!;

        let drawn = 0;
        while (drawn < canvas.height) {
          const h = Math.min(sliceH, canvas.height - drawn);
          pageCanvas.width = canvas.width;
          pageCanvas.height = h;
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, drawn, canvas.width, h, 0, 0, canvas.width, h);

          const pageImg = pageCanvas.toDataURL("image/png");
          if (drawn > 0) pdf.addPage();
          pdf.addImage(pageImg, "PNG", margin, margin, imgW, h / ratio);

          drawn += h;
        }

        pdf.save(`Salary_History_Analysis_${employeeName}.pdf`);
      })(),
      {
        loading: "Exporting PDF…",
        success: "PDF exported.",
        error: "Failed to export PDF.",
      }
    );
  };

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  return (
    <div className="space-y-4">
      {/* Export button (web only) */}
      <div className="flex justify-end no-print">
        <button
          type="button"
          onClick={handleExportPdf}
          className="rounded-md border border-[#355fd0] px-2 py-1 text-xs text-[#355fd0] hover:bg-[#355fd0]/5"
        >
          Export to PDF
        </button>
      </div>

      {/* Content included in PDF */}
      <div ref={captureRef} id="salary-analysis-capture" className="space-y-4">
        {/* Employee name (hidden on web, shown only in export) */}
        <div className="export-only hidden rounded-xl border card px-4 py-3">
          <div className="text-sm text-gray-500">Salary History Analysis</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{employeeName}</div>
        </div>

        {/* Tiles */}
        <div className="tile-grid grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          <Metric title="Current Salary" value={`₱ ${formatMoney(currentSalary)}`} up />
          <Metric
            title="Last Adjustment"
            value={
              <>
                {`${lastAdjustmentAmount >= 0 ? "+" : "−"} ₱ ${formatMoney(Math.abs(lastAdjustmentAmount))} `}
                {Number.isFinite(pct) && (
                  <span style={{ color: lastAdjustmentAmount >= 0 ? "#4CEE52" : "#FF4C4C" }}>
                    ({pct.toFixed(1)}%)
                  </span>
                )}
              </>
            }
            up={lastAdjustmentAmount >= 0}
          />
          <Metric title="Time Gap Between Changes" value={`${daysBetweenChanges} day(s)`} />
        </div>

        {/* Trend card */}
        <div className="rounded-xl border card">
          <div className="border-b px-4 py-2 text-sm font-medium text-gray-700">Salary Trend</div>
          <div className="px-4 py-3">
            {points.length > 0 ? (
              <TrendChart points={points} />
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                There&apos;s no salary trend yet.
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <div className="no-print">
            {!isWriting ? (
              <button
                type="button"
                onClick={startAddNote}
                className="rounded-md border border-[#355fd0] px-3 py-2 text-sm text-[#355fd0] hover:bg-[#355fd0]/5"
              >
                Add HR Notes
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Write an HR note..."
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveNote}
                    disabled={!draft.trim()}
                    className="rounded-md bg-[#355fd0] px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddNote}
                    className="rounded-md border px-4 py-2 text-sm text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-dashed p-4 card">
            {notes.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No HR notes yet.</div>
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
                    <div className="pr-2">
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <div className="mt-2 text-xs text-gray-400">{formatDateTime(n.createdAt)}</div>
                    </div>

                    {/* Delete button (web only; hidden in PDF) */}
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className={`no-print ml-2 flex items-center justify-center text-gray-400 hover:text-red-500 ${
                        deletingId === n.id ? "cursor-wait text-gray-400 hover:text-gray-400" : ""
                      }`}
                      title={deletingId === n.id ? "Deleting…" : "Delete note"}
                      aria-label={`Delete note from ${formatDateTime(n.createdAt)}`}
                      disabled={deletingId === n.id}
                    >
                      {deletingId === n.id ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function TrendIcon({ up = true }: { up?: boolean }) {
  const rotate = up ? undefined : "rotate(180 6.5 9.5)";
  const fill = up ? "#4CEE52" : "#FF4C4C";
  return (
    <svg
      viewBox="0 0 13 19"
      width={13}
      height={19}
      className="absolute right-2 top-2 print:block"
      aria-hidden="true"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={rotate}>
        <path d="M12.666 18.9902L0.666016 18.9902L6.66602 9.99023L12.666 18.9902ZM12.666 8.99023L0.666016 8.99023L6.66602 -0.00976562L12.666 8.99023Z" fill={fill} />
      </g>
    </svg>
  );
}

function Metric({ title, value, up }: { title: string; value: React.ReactNode; up?: boolean }) {
  return (
    <div className="metric-card relative flex h-28 flex-col items-center justify-center rounded-xl border border-slate-300/70 p-4 print:break-inside-avoid">
      {up !== undefined && <TrendIcon up={up} />}
      <div className="text-lg font-semibold text-slate-800">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{title}</div>
    </div>
  );
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDateTime(d: Date) {
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
