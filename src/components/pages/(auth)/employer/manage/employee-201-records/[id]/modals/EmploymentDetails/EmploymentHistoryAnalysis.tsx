"use client";

import { useEffect } from "react";
import { useEmploymentHistoryAnalysis } from "../../hooks/useEmploymentHistoryAnalysis";

export default function EmploymentHistoryAnalysis({
  employeeId,
  employeeName,
  onBack,
  onClose,
}: {
  employeeId: number | string;
  employeeName: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const { data, error, loading, fetchAnalysis } = useEmploymentHistoryAnalysis();

  useEffect(() => {
    const abort = new AbortController();
    fetchAnalysis(employeeId, { include_details: true }, abort.signal).catch(() => {});
    return () => abort.abort();
  }, [employeeId, fetchAnalysis]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Sub-header back */}
      <div className="px-6 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#355fd0] hover:underline"
        >
          <span aria-hidden>←</span> Back
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-2">
        {/* Loading view */}
        {loading && (
          <div
            className="space-y-4"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <h3 className="h-5 w-72 animate-pulse rounded bg-gray-200/70" />
            <div className="rounded-xl border bg-[#f6f8ff] p-4 sm:p-6">
              <ul className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-white p-3 sm:p-4 shadow-sm"
                  >
                    <div className="h-4 w-60 animate-pulse rounded bg-gray-200/80" />
                    <div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-200/70" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-4 sm:p-6">
              <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200/80" />
              <ul className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="rounded-md border p-3">
                    <div className="h-4 w-72 animate-pulse rounded bg-gray-200/80" />
                    <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-200/70" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !data && (
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
            No analysis available.
          </div>
        )}

        {/* Data view */}
        {!loading && !error && data && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Employment History Analysis — {employeeName}
            </h3>

            <div className="rounded-xl border bg-[#f6f8ff] p-4 sm:p-6">
              <ul className="space-y-3 text-sm text-gray-700">
                <Li label="Total Years of Experience" value={data.total_experience} />
                <Li label="Average Tenure per Job" value={data.average_tenure} sub="(average across all roles)" />

                {data.current_role && (
                  <Li
                    label="Current Role Tenure"
                    value={`${data.current_role.tenure}`}
                    sub={`${data.current_role.title} @ ${data.current_role.company}`}
                  />
                )}

                {data.longest_tenure && (
                  <Li
                    label="Longest Tenure"
                    value={data.longest_tenure.tenure}
                    sub={`${data.longest_tenure.title} @ ${data.longest_tenure.company}`}
                  />
                )}

                <Li label="Stability Indicator" value={data.stability_indicator} />

                {/* Career progression summary */}
                {data.career_progression?.length > 0 ? (
                  <li className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
                    <div className="font-semibold">• Career Progression</div>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      {data.career_progression.map((step, i) => (
                        <div key={i}>
                          {step.from} → {step.to} — <span className="font-medium">{step.type}</span>
                        </div>
                      ))}
                    </div>
                  </li>
                ) : (
                  <Li label="Career Progression" value="—" />
                )}

                {/* Optional domain tag if computed */}
                <Li label="Overall Path" value={data.overall_path} />
                {typeof data.industry_consistency_pct === "number" && data.top_industry && (
                  <Li
                    label="Industry Consistency"
                    value={`${data.industry_consistency_pct}%`}
                    sub={`Top domain: ${data.top_industry}`}
                  />
                )}
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-white px-6 py-4 rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[#355fd0] px-4 py-2 text-sm text-[#355fd0] hover:bg-[#355fd0]/5"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f54b8]"
        >
          Back
        </button>
      </div>
    </div>
  );
}

/* ---------- small presentational helper ---------- */
function Li({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <li className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
      <div className="font-semibold">
        • {label}: <span className="font-normal">{value}</span>
      </div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </li>
  );
}
