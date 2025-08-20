"use client";

import { useMemo } from "react";

export type EmploymentHistoryItem = {
  position: string;
  company: string;
  dateFrom: string; // ISO
  dateTo?: string; // ISO | undefined (ongoing)
  description?: string;
};

export default function EmploymentHistoryAnalysis({
  employeeName,
  items,
  onBack,
  onClose,
}: {
  employeeName: string;
  items: EmploymentHistoryItem[];
  onBack: () => void;
  onClose: () => void;
}) {
  const {
    totalMonths,
    avgMonths,
    current,
    longest,
    progressionText,
    industryText,
    stabilityText,
  } = useMemo(() => computeInsights(items), [items]);

  if (!items.length) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-[#355fd0] hover:underline"
          >
            <span aria-hidden>←</span> Back
          </button>
        </div>
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
          No employment history to analyze yet.
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#355fd0] px-4 py-2 text-sm text-[#355fd0] hover:bg-[#355fd0]/5"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
        <div className="rounded-xl border bg-[#f6f8ff] p-4 sm:p-6">
          <ul className="space-y-3 text-sm text-gray-700">
            <Li label="Total Years of Experience" value={fmtYM(totalMonths)} />
            <Li
              label="Average Tenure per Job"
              value={fmtYM(avgMonths)}
              sub="(average across all roles)"
            />
            <Li
              label="Current Role Tenure"
              value={`${fmtYM(current.months)}${
                current.ongoing ? " (ongoing)" : ""
              }`}
              sub={`${current.item.position} @ ${current.item.company}`}
            />
            <Li
              label="Longest Tenure"
              value={fmtYM(longest.months)}
              sub={`${longest.item.position} @ ${longest.item.company}`}
            />
            <Li label="Career Progression" value={progressionText} />
            <Li label="Industry Consistency" value={industryText} />
            <Li label="Stability Indicator" value={stabilityText} />
          </ul>
        </div>
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
function Li({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <li className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
      <div className="font-semibold">
        • {label}: <span className="font-normal">{value}</span>
      </div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </li>
  );
}

/* ---------- analysis helpers ---------- */
function computeInsights(items: EmploymentHistoryItem[]) {
  // sort by start date asc
  const data = [...items].sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );

  const monthsList = data.map((r) =>
    monthsBetween(r.dateFrom, r.dateTo ?? new Date().toISOString())
  );

  const totalMonths = monthsList.reduce((s, m) => s + m, 0);
  const avgMonths = totalMonths / data.length;

  // current = ongoing if exists, else the most recent by dateFrom
  const ongoing = data.filter((d) => !d.dateTo);
  const currentItem =
    ongoing.length > 0
      ? ongoing.sort(
          (a, b) =>
            new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
        )[0]
      : data[data.length - 1];

  const currentMonths = monthsBetween(
    currentItem.dateFrom,
    currentItem.dateTo ?? new Date().toISOString()
  );

  // longest
  let longestIdx = 0;
  monthsList.forEach((m, i) => {
    if (m > monthsList[longestIdx]) longestIdx = i;
  });

  // progression heuristic
  const score = (title: string) => {
    const t = title.toLowerCase();
    const rankMap: [string, number][] = [
      ["intern", 1],
      ["trainee", 2],
      ["assistant", 3],
      ["clerk", 3],
      ["associate", 4],
      ["specialist", 5],
      ["analyst", 5],
      ["officer", 6],
      ["senior", 7],
      ["lead", 8],
      ["supervisor", 8],
      ["manager", 9],
      ["head", 10],
      ["director", 11],
      ["vp", 12],
      ["chief", 13],
      ["cfo", 13],
      ["coo", 13],
      ["ceo", 13],
    ];
    const hit = rankMap.find(([k]) => t.includes(k));
    return hit ? hit[1] : 5; // default mid-level
  };
  const deltas: number[] = [];
  for (let i = 1; i < data.length; i++) {
    deltas.push(score(data[i].position) - score(data[i - 1].position));
  }
  const avgDelta = deltas.length
    ? deltas.reduce((s, d) => s + d, 0) / deltas.length
    : 0;
  const progressionText =
    avgDelta > 0.6
      ? "Steady upward movement across roles."
      : avgDelta > 0.2
      ? "Gradual upward trajectory."
      : avgDelta > -0.2
      ? "Stable level across roles."
      : "Mixed/declining trajectory.";

  // industry consistency heuristic (by keywords in titles)
  const acctFinKeywords = [
    "account",
    "finance",
    "payable",
    "receivable",
    "auditor",
    "treasury",
  ];
  const domainHits = data.filter((d) =>
    acctFinKeywords.some((k) => d.position.toLowerCase().includes(k))
  ).length;
  const share = domainHits / data.length;
  const industryText =
    share >= 0.8
      ? "High consistency in finance/accounting domain."
      : share >= 0.5
      ? "Moderate consistency within related roles."
      : "Diverse role background across domains.";

  // stability indicator (avg tenure)
  const stabilityText =
    avgMonths >= 36
      ? "Low job-hopping risk — stays ~3+ years per role."
      : avgMonths >= 24
      ? "Moderate stability — ~2–3 years per role."
      : "Higher mobility — typically <2 years per role.";

  return {
    totalMonths,
    avgMonths,
    current: {
      item: currentItem,
      months: currentMonths,
      ongoing: !currentItem.dateTo,
    },
    longest: { item: data[longestIdx], months: monthsList[longestIdx] },
    progressionText,
    industryText,
    stabilityText,
  };
}

function monthsBetween(fromISO: string, toISO: string) {
  const a = new Date(fromISO);
  const b = new Date(toISO);
  // count months by year/month plus day adjustment
  let months =
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  // day adjustment: if end day >= start day count the partial month
  if (b.getDate() >= a.getDate()) months += 1;
  return Math.max(0, months);
}

function fmtYM(months: number) {
  const y = Math.floor(months / 12);
  const m = Math.max(0, Math.round(months % 12));
  const yPart = y > 0 ? `${y} year${y > 1 ? "s" : ""}` : "";
  const mPart = m > 0 ? `${m} month${m > 1 ? "s" : ""}` : "";
  return [yPart, mPart].filter(Boolean).join(", ") || "0 month";
}
