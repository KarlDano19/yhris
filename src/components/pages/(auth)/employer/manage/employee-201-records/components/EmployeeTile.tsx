"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { Employee } from "@/types/employee-201-records/employee";

export default function EmployeeTile({ emp }: { emp: Employee }) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [side, setSide] = useState<"right" | "left" | "bottom">("right");
  const tileRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
    const needed = 320;
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    if (spaceRight >= needed) setSide("right");
    else if (spaceLeft >= needed) setSide("left");
    else setSide("bottom");
  };
  const handleLeave = () => { hideTimer.current = setTimeout(() => setOpen(false), 200); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Link href={`/manage/employee-201-records/${emp.id}`} className="block">
      <div ref={tileRef} className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer">
        {!emp.complete && (
          <div className="absolute top-4 right-5 z-20" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <div className="relative">
              <button
                type="button"
                aria-label="View incomplete record details"
                aria-expanded={open}
                className="flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-xs font-bold ring-2 ring-white"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
              >i</button>

              {open && (
                <div
                  className={
                    "absolute z-50 w-[76vw] max-w-[260px] sm:w-[300px] rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-xl ring-1 ring-black/5 " +
                    (side === "right" ? "top-0 left-full ml-2" : side === "left" ? "top-0 right-full mr-2" : "top-6 right-0")
                  }
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <div className="mb-2 sm:mb-3 text-[12px] sm:text-[13px] font-semibold text-gray-900">
                    Incomplete Records {" "}
                    <span className="font-bold text-rose-500">({emp.missingCount}/{emp.totalCount})</span>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px]">
                    <details className="group" open>
                      <summary className="flex items-center justify-between cursor-pointer select-none rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-500">Employment Details</span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="mt-1 ml-7 pl-4 list-decimal space-y-1 text-rose-600">
                        <li>Salary &amp; Compensation</li>
                      </ol>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer select-none rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-500">Document Repository</span>
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

        <div className="mx-auto w-24 h-24 relative">
          <div className={`absolute inset-0 rounded-full border-4 ${emp.complete ? "border-yellow-400" : "border-yellow-400 border-dashed"} scale-110`} />
          <Image src={emp.avatar} alt={`${emp.name} ${emp.complete ? "– complete" : "– incomplete"}`} width={96} height={96} className="rounded-full object-cover" />
        </div>

        <div className="mt-3 text-center">
          <div className="text-sm font-semibold text-gray-800">{emp.name}</div>
          {emp.complete ? (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Complete Records
            </div>
          ) : (
            <div className="mt-2">
              <div
                className="h-2 w-40 mx-auto overflow-hidden rounded-full bg-rose-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={emp.percent ?? 0}
                aria-label="Record completion"
              >
                <div className="h-full bg-rose-400" style={{ width: `${emp.percent ?? 0}%` }} />
              </div>
              <div className="mt-1 text-[11px] font-medium text-rose-600">Incomplete Records{typeof emp.percent === "number" ? ` • ${emp.percent}%` : ""}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}