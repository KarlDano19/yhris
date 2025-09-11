"use client";

import { useRef, useState, useMemo } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";

import TrendChart, { TrendPoint } from "../../common/TrendChart";

import Pagination from "@/components/Pagination";

import { notify } from "../../utils/notify";
import { useGetSalaryAnalysis } from "../../hooks/useGetSalaryAnalysis";

import { useGetHRNotes } from "../../hooks/useGetHRNotes";
import { useAddHRNote } from "../../hooks/useAddHRNote";
import { useDeleteHRNote } from "../../hooks/useDeleteHRNote";

export default function SalaryHistoryAnalysis({
  employeeId,
  employeeName,
  onExportPdf,
}: {
  employeeId: number | string;
  employeeName: string;
  onExportPdf?: () => void;
}) {
  /* ---------------- SALARY ANALYSIS ---------------- */
  const { data, isLoading, error, refetch } = useGetSalaryAnalysis(employeeId);
  const showLoading = isLoading || !data;
  // Derived UI values (guarded)
  const currentSalary = data?.currentSalary ?? 0;
  const lastAdjustmentAmount = data?.lastAdjustmentAmount ?? 0;
  const daysBetweenChanges = data?.daysBetweenChanges ?? 0;

  const points: TrendPoint[] = useMemo(
    () =>
      (data?.entries ?? []).map((e) => ({
        x: new Date(e.effectiveDate).getTime(),
        y: e.salary,
      })),
    [data?.entries]
  );

  // % calc based on backend delta & current (previous = current - delta)
  const prevSalary =
    Number.isFinite(currentSalary) && Number.isFinite(lastAdjustmentAmount)
      ? currentSalary - lastAdjustmentAmount
      : 0;
  const pct = prevSalary > 0 ? (lastAdjustmentAmount / prevSalary) * 100 : 0;

  /* ---------------- HR NOTES (hooks + pagination) ---------------- */
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pageType = "employee201"; // for your Pagination sizing presets

  const {
    notes,
    isLoading: notesLoading,
    error: notesError,
    meta,
    refetch: refetchNotes,
  } = useGetHRNotes(employeeId, { page, pageSize });

  // derive totals for Pagination
  const totalRecords = meta?.total_records ?? notes.length;
  const totalPages =
    meta?.total_pages ?? Math.max(1, Math.ceil(totalRecords / pageSize));

  // Pagination handlers (changing these state values triggers the hook to refetch)
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1); // react-paginate is 0-based
  };

  const { isSaving, addNote } = useAddHRNote(employeeId);
  const { isDeleting, deleteNote } = useDeleteHRNote(employeeId);

  // Add note UI
  const [isWriting, setIsWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const startAddNote = () => {
    setIsWriting(true);
    setDraft("");
  };
  const cancelAddNote = () => {
    setIsWriting(false);
    setDraft("");
  };
  const saveNote = async () => {
    const text = draft.trim();
    if (!text) return;
    await notify.promise(
      (async () => {
        const res = await addNote(text);
        if (!res.ok) throw res.error;
        setIsWriting(false);
        setDraft("");
        await refetchNotes();
      })(),
      {
        success: "Note added.",
        error: "Failed to add note.",
      }
    );
  };

  const handleDeleteNote = async (id: number) => {
    setDeletingId(id);
    try {
      await notify.promise(
        (async () => {
          const res = await deleteNote(id);
          if (!res.ok) throw res.error!;
          await refetchNotes();
        })(),
        {
          success: "Note deleted.",
          error: "Failed to delete note.",
        }
      );
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
          ctx.drawImage(
            canvas,
            0,
            drawn,
            canvas.width,
            h,
            0,
            0,
            canvas.width,
            h
          );

          const pageImg = pageCanvas.toDataURL("image/png");
          if (drawn > 0) pdf.addPage();
          pdf.addImage(pageImg, "PNG", margin, margin, imgW, h / ratio);

          drawn += h;
        }

        pdf.save(`Salary_History_Analysis_${employeeName}.pdf`);
      })(),
      { success: "PDF exported.", error: "Failed to export PDF." }
    );
  };

  const trend = (n: number | undefined) => (n === 0 ? undefined : n! > 0);

  /* ---------- SINGLE RETURN (inline loading & error) ---------- */
  return (
    <div className="space-y-4">
      {/* Top controls + inline error banner */}
      <div className="flex items-center justify-between no-print">
        {error ? (
          <div className="mr-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>{error.message || "Failed to load salary analysis."}</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : (
          <div />
        )}

        <button
          data-testid="export-pdf-btn"
          type="button"
          onClick={handleExportPdf}
          disabled={showLoading}
          className={`rounded-md border border-[#355fd0] px-2 py-1 text-xs ${
            showLoading
              ? "cursor-not-allowed opacity-60 text-[#355fd0]"
              : "text-[#355fd0] hover:bg-[#355fd0]/5"
          }`}
          title={showLoading ? "Please wait…" : "Export to PDF"}
        >
          {showLoading ? "Preparing…" : "Export to PDF"}
        </button>
      </div>

      {/* Content included in PDF */}
      <div ref={captureRef} id="salary-analysis-capture" className="space-y-4">
        {/* Employee name (hidden on web, shown only in export) */}
        <div className="export-only hidden rounded-xl border card px-4 py-3">
          <div className="text-sm text-gray-500">Salary History Analysis</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {employeeName}
          </div>
        </div>

        {/* Tiles */}
        <div className="tile-grid grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {showLoading ? (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 rounded-xl border p-4 bg-white">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </>
          ) : (
            <>
              <Metric
                dataTestid="current-salary-tile"
                title="Current Salary"
                value={`₱ ${formatMoney(currentSalary)}`}
                up={trend(lastAdjustmentAmount)} 
              />

              <Metric
                dataTestid="last-adjustment-tile"
                title="Last Adjustment"
                value={
                  <>
                    {lastAdjustmentAmount > 0
                      ? `+ ₱ ${formatMoney(lastAdjustmentAmount)}`
                      : lastAdjustmentAmount < 0
                      ? `− ₱ ${formatMoney(Math.abs(lastAdjustmentAmount))}`
                      : `₱ 0`}
                    {Number.isFinite(pct) && lastAdjustmentAmount !== 0 && (
                      <span
                        className="pl-2"
                        style={{
                          color:
                            lastAdjustmentAmount > 0 ? "#4CEE52" : "#FF4C4C",
                        }}
                      >
                        ({pct.toFixed(1)}%)
                      </span>
                    )}
                  </>
                }
                up={trend(lastAdjustmentAmount)} 
              />

              <Metric
                dataTestid="time-gap-tile"
                title="Time Gap Between Changes"
                value={`${daysBetweenChanges} day(s)`}
              />
            </>
          )}
        </div>

        {/* Trend card */}
        <div className="rounded-xl border card">
          <div className="border-b px-4 py-2 text-sm font-medium text-gray-700">
            Salary Trend
          </div>
          <div className="px-4 py-3">
            {showLoading ? (
              <div className="h-48 w-full rounded bg-gray-100 animate-pulse" />
            ) : points.length > 0 ? (
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
            {/* Left: Add HR Notes / inline editor */}
            {!isWriting ? (
              <button
                data-testid="add-hr-note-btn"
                type="button"
                onClick={startAddNote}
                disabled={notesLoading || !!notesError}
                className={`rounded-md border px-3 py-2 text-sm ${
                  notesLoading || notesError
                    ? "cursor-not-allowed border-gray-300 text-gray-400"
                    : "border-[#355fd0] text-[#355fd0] hover:bg-[#355fd0]/5"
                }`}
                title={notesError ? "Fix the error before adding." : undefined}
              >
                Add HR Notes
              </button>
            ) : (
              <div className="flex-1 mr-4">
                <div className="space-y-2">
                  <textarea
                    data-testid="hr-note-content-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder="Write an HR note..."
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="save-hr-note-btn"
                      type="button"
                      onClick={saveNote}
                      disabled={!draft.trim() || isSaving}
                      className="rounded-md bg-[#355fd0] px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {isSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      data-testid="cancel-hr-note-btn"
                      type="button"
                      onClick={cancelAddNote}
                      disabled={isSaving}
                      className="rounded-md border px-4 py-2 text-sm text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes list */}
        <div className="rounded-xl border border-dashed p-4 card">
          {notesError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {notesError.message || "Failed to load HR notes."}
            </div>
          )}

          {notesLoading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="flex items-start justify-between rounded-lg border bg-white p-3"
                >
                  <div className="pr-2 w-full">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-2 h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>
          ) : notes.length === 0 ? (
            <div data-testid="no-notes-view" className="p-6 text-center text-sm text-gray-500">
              No HR notes yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li
                  data-testid="note-item"
                  key={n.id}
                  className="flex items-start justify-between rounded-lg border bg-white p-3"
                >
                  <div className="pr-2">
                    <p data-testid="note-content" className="text-sm text-gray-700 whitespace-pre-wrap">
                      {n.note_content}
                    </p>
                    <div data-testid="note-created" className="mt-2 text-xs text-gray-400">
                      {formatDateTime(new Date(n.date_created))}
                    </div>
                  </div>

                  <button
                    data-testid="delete-hr-note-btn"
                    type="button"
                    onClick={() => handleDeleteNote(n.id)}
                    className={`no-print ml-2 flex items-center justify-center text-gray-400 hover:text-red-500 ${
                      deletingId === n.id
                        ? "cursor-wait text-gray-400 hover:text-gray-400"
                        : ""
                    }`}
                    title={deletingId === n.id ? "Deleting…" : "Delete note"}
                    aria-label={`Delete note from ${formatDateTime(
                      new Date(n.date_created)
                    )}`}
                    disabled={deletingId === n.id || isDeleting}
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

        <Pagination
          pagination={{
            totalPages,
            totalRecords,
          }}
          currentPage={page}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          pageType={pageType}
        />
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
        <path
          d="M12.666 18.9902L0.666016 18.9902L6.66602 9.99023L12.666 18.9902ZM12.666 8.99023L0.666016 8.99023L6.66602 -0.00976562L12.666 8.99023Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

function Metric({
  title,
  value,
  up,
  dataTestid
}: {
  title: string;
  value: React.ReactNode;
  up?: boolean;
  dataTestid?: string;
}) {
  return (
    <div data-testid={dataTestid} className="metric-card relative flex h-28 flex-col items-center justify-center rounded-xl border border-slate-300/70 p-4 print:break-inside-avoid">
      {up !== undefined && <TrendIcon up={up} />}
      <div className="flex w-full items-center justify-center text-center font-semibold text-slate-800">
        {value}
      </div>
      <div className="mt-1 text-xs text-gray-500">{title}</div>
    </div>
  );
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
