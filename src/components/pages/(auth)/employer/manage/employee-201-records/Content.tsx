"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// ────────────────────────────────────────────────────────────────────────────────
// Mock data – replace with your real data later
// ────────────────────────────────────────────────────────────────────────────────
type Employee = {
  id: string;
  name: string;
  avatar: string;
  complete: boolean;
  location?: string; // e.g. "Manila"
  department?: string; // e.g. "HR"
  position?: string; // e.g. "Manager"
  percent?: number; // if incomplete, e.g. 62
  alert?: boolean; // small red dot on the avatar (like your mock)
  missingCount?: number; // e.g. 3
  totalCount?: number; // e.g. 5
};

const EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Adrian Cortez",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "2",
    name: "Bianca Reyes",
    avatar: "/assets/placeholder2.png",
    complete: false,
    percent: 25,
    alert: true,
  },
  {
    id: "3",
    name: "Carlos Mendoza",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "4",
    name: "Diane Villanueva",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "5",
    name: "Elias Santos",
    avatar: "/assets/placeholder2.png",
    complete: true,
  },
  {
    id: "6",
    name: "Faye Domingo",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "7",
    name: "Gabriel Navarro",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "8",
    name: "Hazel De Guzman",
    avatar: "/assets/placeholder2.png",
    complete: true,
  },
  {
    id: "9",
    name: "Ivan Morales",
    avatar: "/assets/placeholder1.png",
    complete: false,
    percent: 75,
    alert: true,
  },
  {
    id: "10",
    name: "Janelle Cruz",
    avatar: "/assets/placeholder2.png",
    complete: true,
  },
  {
    id: "11",
    name: "Kevin Salazar",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
  {
    id: "12",
    name: "Lara Bautista",
    avatar: "/assets/placeholder1.png",
    complete: true,
  },
];

const Content = ({
  hasActiveSubscription,
}: {
  hasActiveSubscription: boolean;
}) => {
  // UI state
  const [q, setQ] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);
  const [loc, setLoc] = useState("ALL");
  const [dept, setDept] = useState("ALL");
  const [pos, setPos] = useState("ALL");

  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current?.contains(e.target as Node)) setShowFilter(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  // derive filtered data
  const filtered = useMemo(() => {
    let base = EMPLOYEES.filter((e) =>
      e.name.toLowerCase().includes(q.trim().toLowerCase())
    );
    // Example: if your Employee has fields like e.location / e.department / e.position
    if (loc !== "ALL") base = base.filter((e) => e.location === loc);
    if (dept !== "ALL") base = base.filter((e) => e.department === dept);
    if (pos !== "ALL") base = base.filter((e) => e.position === pos);
    return base;
  }, [q, loc, dept, pos]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // whenever filters/search change, reset to page 1
  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const onToggleIncomplete = () => {
    setOnlyIncomplete((v) => !v);
    setPage(1);
  };
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* top bar */}
        <div className="flex p-4">
          <Link
            href="/manage"
            className="flex-none flex gap-3 items-center rounded-md px-2 py-1 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-gray-700">Manage</h4>
          </Link>
        </div>

        {/* title */}
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Employee 201 Records
          </h2>
        </div>

        {/* actions */}
        <div className="mt-6 px-2 md:px-8 lg:px-4 flex items-center gap-3">
          {/* search */}
          <div className="relative w-full max-w-md">
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search…"
              className="w-full border border-gray-200 bg-white pl-3 pr-10 py-2.5 text-sm rounded-md outline-none ring-0 placeholder:text-gray-400 focus:border-[#355fd0]"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Filter trigger + popover */}
          <div className="relative inline-block" ref={filterRef}>
            <button
              onClick={() => setShowFilter((s) => !s)}
              className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm rounded-md hover:bg-gray-50"
              aria-haspopup="dialog"
              aria-expanded={showFilter}
            >
              <FunnelIcon className="h-5 w-5 text-gray-700" />
              <span className="text-gray-800 font-medium">Filter</span>
            </button>

            {showFilter && (
              <div
                role="dialog"
                aria-label="Employee filters"
                className={`
      absolute z-40 mt-3
    left-auto right-0 translate-x-0 w-[75vw] max-w-[260px] /* much smaller + centered on mobile */
    sm:left-auto sm:right-0 sm:translate-x-0 sm:w-[420px] sm:max-w-none /* desktop unchanged */
    rounded-xl border border-gray-200 bg-white shadow-xl
    `}
              >
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <select
                        value={loc}
                        onChange={(e) => setLoc(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                      >
                        <option>ALL</option>
                        <option>Manila</option>
                        <option>Cebu</option>
                        <option>Davao</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                      >
                        <option>ALL</option>
                        <option>HR</option>
                        <option>Finance</option>
                        <option>Engineering</option>
                        <option>Operations</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                      Position
                    </label>
                    <div className="relative">
                      <select
                        value={pos}
                        onChange={(e) => setPos(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                      >
                        <option>ALL</option>
                        <option>Associate</option>
                        <option>Manager</option>
                        <option>Director</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="pt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => {
                        setLoc("ALL");
                        setDept("ALL");
                        setPos("ALL");
                      }}
                      className="rounded-lg border border-[#355fd0] bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/10"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="rounded-lg bg-[#355fd0] px-5 py-1.5 sm:px-6 sm:py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* grid of tiles */}
        <div className="px-2 md:px-8 lg:px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {paged.map((emp) => (
            <EmployeeTile key={emp.id} emp={emp} />
          ))}
          {paged.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
              No results
            </div>
          )}
        </div>

        {/* footer: totals + pagination */}
        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Total Record/s: {filtered.length}
          </div>

          <div className="flex items-center gap-3">
            {/* page size */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Records per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
              >
                {[15, 30, 60].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* pager */}
            <nav className="flex items-center gap-1">
              <button
                onClick={goPrev}
                disabled={safePage === 1}
                className="rounded-full p-2 disabled:opacity-40 hover:bg-gray-100"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <div className="min-w-[2.5rem] text-center text-sm text-gray-700">
                {safePage} / {totalPages}
              </div>
              <button
                onClick={goNext}
                disabled={safePage === totalPages}
                className="rounded-full p-2 disabled:opacity-40 hover:bg-gray-100"
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;

// ────────────────────────────────────────────────────────────────────────────────
// Tile component (styled like the mock)
// ────────────────────────────────────────────────────────────────────────────────

function EmployeeTile({ emp }: { emp: Employee }) {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [side, setSide] = useState<"right" | "left" | "bottom">("right");
  const tileRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setIsHovered(true);
    // Decide where to place the popover (prefer right)
    const needed = 320; // ~w-72 incl. shadow/padding
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    if (spaceRight >= needed) setSide("right");
    else if (spaceLeft >= needed) setSide("left");
    else setSide("bottom"); // mobile fallback
  };

  const handleLeave = () => {
    hideTimer.current = setTimeout(() => setIsHovered(false), 180);
  };

  return (
    <Link href={`/manage/employee-201-records/${emp.id}`}>
      <div
        ref={tileRef}
        className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        {/* Info badge (hover target) */}
        {!emp.complete && (
          <div
            className="absolute top-4 right-5 z-20"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className="relative">
              {/* The i button */}
              <span
                className="flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-xs font-bold ring-2 ring-white cursor-pointer"
                onClick={(e) => e.stopPropagation()} // <-- block tile click
                onMouseDown={(e) => e.stopPropagation()} // <-- guard mousedown->click
              >
                i
              </span>

              {/* The hover modal */}
              {isHovered && (
                <div
                  className={
                    "absolute z-50 w-[76vw] max-w-[260px] sm:w-[300px] rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-xl ring-1 ring-black/5 " +
                    (side === "right"
                      ? "top-0 left-full ml-2"
                      : side === "left"
                      ? "top-0 right-full mr-2"
                      : "top-6 right-0")
                  }
                  onClick={(e) => e.stopPropagation()} // <-- block inside clicks
                  onMouseDown={(e) => e.stopPropagation()} // <-- block press
                  onPointerDown={(e) => e.stopPropagation()} // <-- covers touch
                  onKeyDown={(e) => e.stopPropagation()} // <-- keyboard
                >
                  {/* Header */}
                  <div className="mb-2 sm:mb-3 text-[12px] sm:text-[13px] font-semibold text-gray-900">
                    Incomplete Records{" "}
                    <span className="font-bold text-rose-500">
                      ({emp.missingCount}/{emp.totalCount})
                    </span>
                  </div>

                  {/* Sections */}
                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px]">
                    {/* Employment Details */}
                    <details className="group" open>
                      <summary className="flex items-center justify-between cursor-pointer select-none rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-500">
                          Employment Details
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="mt-1 ml-7 pl-4 list-decimal space-y-1 text-rose-600">
                        <li>Salary &amp; Compensation</li>
                      </ol>
                    </details>

                    {/* Document Repository */}
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer select-none rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-500">
                          Document Repository
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="mt-1 ml-7 pl-4 list-decimal space-y-1 text-rose-600">
                        <li>Job Offer Letter</li>
                        <li>Signed Employment Contract</li>
                        <li>Certificate of Employment (issued)</li>
                      </ol>
                    </details>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Avatar + outline */}
        <div className="mx-auto w-24 h-24 relative">
          <div
            className={`absolute inset-0 rounded-full border-4 border-yellow-400 ${
              emp.complete ? "border-solid" : "border-dashed"
            } scale-110`}
          />
          <Image
            src={emp.avatar}
            alt={emp.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        {/* Name + status */}
        <div className="mt-3 text-center">
          <div className="text-sm font-semibold text-gray-800">{emp.name}</div>
          {emp.complete ? (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Complete Records
            </div>
          ) : (
            <div className="mt-2">
              <div className="h-2 w-40 mx-auto overflow-hidden rounded-full bg-rose-100">
                <div
                  className="h-full bg-rose-400"
                  style={{ width: `${emp.percent ?? 0}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] font-medium text-rose-600">
                Incomplete Records
                {typeof emp.percent === "number" ? ` • ${emp.percent}%` : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
