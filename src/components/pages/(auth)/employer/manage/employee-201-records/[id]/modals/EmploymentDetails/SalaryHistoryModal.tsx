"use client";

import { useRef, useState } from "react";
import SalaryHistoryHistory from "./SalaryHistoryHistory";
import SalaryHistoryAnalysis from "./SalaryHistoryAnalysis";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: number | string;
};

export default function SalaryHistoryModal({
  isOpen,
  onClose,
  employeeName,
  employeeId,
}: Props) {
  const [tab, setTab] = useState<"history" | "analysis">("history");
  const dialogRef = useRef<HTMLDivElement>(null);

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
        {/* Title Bar */}
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

        {/* Tabs */}
        <div className="sticky top-[44px] z-10 bg-white px-4 pt-3">
          <div className="flex gap-6 border-b">
            <TabButton active={tab === "history"} onClick={() => setTab("history")}>
              History
            </TabButton>
            <TabButton active={tab === "analysis"} onClick={() => setTab("analysis")}>
              Analysis
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "history" ? (
            <SalaryHistoryHistory employeeId={employeeId} />
          ) : (
            // We'll wire the analysis API next; for now, render an empty state
            <SalaryHistoryAnalysis
              employeeName={employeeName}
              employeeId={employeeId}
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
