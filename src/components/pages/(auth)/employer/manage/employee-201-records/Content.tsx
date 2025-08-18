"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import SearchBar from "./components/SearchBar";
import FilterPopover from "./components/FilterPopover";
import EmployeeGrid from "./components/EmployeeGrid";
import Pagination from "@/components/Pagination";
import SkeletonGrid from "./components/SkeletonGrid";
import { useEmployees } from "./hooks/useEmployees";

export default function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [q, setQ] = useState("");

  // hook now controls search, filters, AND pagination
  const {
    data,
    meta,
    isLoading,
    error,
    refetch,
    query,
    setSearch,
    applyFilters,
    setPage,
    setPageSize,
  } = useEmployees({
    q,
    location: "ALL",
    department: "ALL",
    position: "ALL",
    onlyIncomplete: false,
    page: 1,
    pageSize: 15,
  });

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(q), 300);
    return () => clearTimeout(t);
  }, [q, setSearch]);

  // filter popover plumbing
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => { if (!filterRef.current?.contains(e.target as Node)) setShowFilter(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowFilter(false); };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDocClick); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex p-4">
        <Link href="/manage" className="flex-none flex gap-3 items-center rounded-md px-2 py-1 hover:bg-gray-100">
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
          <h4 className="text-gray-700">Manage</h4>
        </Link>
      </div>

      <div className="px-2 md:px-8 lg:px-4">
        <h2 className="text-xl font-bold text-indigo-dye">Employee 201 Records</h2>
      </div>


      {/* actions */}
      <div className="mt-6 px-2 md:px-8 lg:px-4 flex items-center gap-3">
        <SearchBar value={q} onChange={setQ} />

        <div className="relative inline-block" ref={filterRef}>
          <FilterPopover
            open={showFilter}
            onOpenChange={setShowFilter}
            initial={{
              location: query.location,
              department: query.department,
              position: query.position,
              onlyIncomplete: query.onlyIncomplete,
            }}
            onApply={(vals) => {
              applyFilters(vals);  // triggers API + resets to page 1 inside hook
            }}
          />
        </div>
      </div>

      {/* content */}
      <div className="px-2 md:px-8 lg:px-4 mt-6">
        {isLoading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
            Failed to load employees. <button className="underline" onClick={() => refetch()}>Retry</button>
          </div>
        ) : (
          <EmployeeGrid employees={data ?? []} />
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
            No results
          </div>
        )}
      </div>

      {/* footer */}
      <div className="px-2 md:px-8 lg:px-4 mt-8 mb-12">
            <Pagination
              pagination={{ totalPages: meta.totalPages, totalRecords: meta.total }}
              currentPage={query.page}                     // 1-based
              pageSize={query.pageSize}
              onPageSizeChange={(n) => setPageSize(n)}     // triggers your hook + resets to page 1
              onPageChange={({ selected }) => setPage(selected + 1)} // react-paginate is 0-based
              pageType="employee201" // optional, if you want custom page-size buckets
            />
          </div>
    </div>
  );
}