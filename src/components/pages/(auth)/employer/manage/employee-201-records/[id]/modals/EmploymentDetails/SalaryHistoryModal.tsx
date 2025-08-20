import { useEffect, useRef, useState } from "react";
import SalaryHistoryHistory from "./SalaryHistoryHistory";
import SalaryHistoryAnalysis from "./SalaryHistoryAnalysis";

export type SalaryHistoryEntry = {
  position: string;
  salary: number;
  effectiveDate: string; // ISO date
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  entries: SalaryHistoryEntry[];

  currentSalary?: number;
  lastAdjustmentAmount?: number;
  daysBetweenChanges?: number;

  onExportPdf?: () => void;
  onAddNote?: () => void;
};

export default function SalaryHistoryModal({
  isOpen,
  onClose,
  employeeName,
  entries,
  currentSalary,
  lastAdjustmentAmount,
  daysBetweenChanges,
  onExportPdf,
  onAddNote,
}: Props) {
  const [tab, setTab] = useState<"history" | "analysis">("history");
  const dialogRef = useRef<HTMLDivElement>(null);

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  );
  const curSalary =
    currentSalary ?? (sorted.length ? sorted[sorted.length - 1].salary : 0);
  const lastAdj =
    lastAdjustmentAmount ??
    (sorted.length >= 2
      ? sorted[sorted.length - 1].salary - sorted[sorted.length - 2].salary
      : 0);
  const gapDays =
    daysBetweenChanges ??
    (sorted.length >= 2
      ? Math.max(
          0,
          Math.round(
            (new Date(sorted[sorted.length - 1].effectiveDate).getTime() -
              new Date(sorted[sorted.length - 2].effectiveDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="salary-history-title"
    >
      <div
        ref={dialogRef}
        className="mt-8 w-full max-w-3xl rounded-xl bg-white shadow-xl flex max-h-[90vh] flex-col"
      >
        {/* Sticky Title Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-xl bg-[#355fd0] px-4 py-3 text-white">
          <h3 id="salary-history-title" className="text-sm font-semibold">
            Salary History: {employeeName}
          </h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-[44px] z-10 bg-white px-4 pt-3">
          <div className="flex gap-6 border-b">
            <TabButton
              active={tab === "history"}
              onClick={() => setTab("history")}
            >
              History
            </TabButton>
            <TabButton
              active={tab === "analysis"}
              onClick={() => setTab("analysis")}
            >
              Analysis
            </TabButton>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "history" ? (
            <SalaryHistoryHistory entries={entries} />
          ) : (
            <SalaryHistoryAnalysis
              employeeName={employeeName}
              currentSalary={curSalary}
              lastAdjustmentAmount={lastAdj}
              daysBetweenChanges={gapDays}
              entries={sorted}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`relative px-1 pb-3 text-sm font-medium ${
        active ? "text-[#355fd0]" : "text-gray-500"
      }`}
      onClick={onClick}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#355fd0]" />
      )}
    </button>
  );
}
