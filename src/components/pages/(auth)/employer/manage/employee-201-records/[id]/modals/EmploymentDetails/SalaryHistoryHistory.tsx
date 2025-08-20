"use client";

import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination"; // ⬅️ adjust path if needed
import { SalaryHistoryEntry } from "./SalaryHistoryModal";

export default function SalaryHistoryHistory({
  entries,
  pageType = "employee201", // ⬅️ lets your Pagination choose sizes [12,24,36,60]
}: {
  entries: SalaryHistoryEntry[];
  pageType?: string;
}) {
  // Pagination state
  const [pageSize, setPageSize] = useState<number>(
    pageType === "employee201" ? 12 : 10
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalRecords = entries.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Slice current page
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return entries.slice(start, end);
  }, [entries, currentPage, pageSize]);

  // Handlers passed to <Pagination />
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1); // reset to first page when page size changes
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1); // react-paginate is 0-based
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Position</Th>
              <Th align="right">Salary</Th>
              <Th align="right">Effective Date</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {pageItems.map((e, i) => (
              <tr key={`${e.effectiveDate}-${i}`}>
                <Td>{e.position}</Td>
                <Td align="right">{formatMoney(e.salary)}</Td>
                <Td align="right">
                  {new Date(e.effectiveDate).toLocaleDateString()}
                </Td>
              </tr>
            ))}

            {totalRecords === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-500"
                  colSpan={3}
                >
                  No salary records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <Pagination
        pagination={{ totalPages, totalRecords }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        pageType={pageType}
      />
    </div>
  );
}

/* ---------- table cell helpers ---------- */

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-4 py-3 text-sm ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </td>
  );
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
