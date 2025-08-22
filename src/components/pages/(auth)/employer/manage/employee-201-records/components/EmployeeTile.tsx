"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import PlacholderPicture from "@/svg/PlaceholderPicture"; // ⬅️ use the dynamic SVG
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
  const handleLeave = () => {
    hideTimer.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isSvgAvatar = emp.avatar === "male" || emp.avatar === "female";

  return (
    <Link href={`/manage/employee-201-records/${emp.id}`} className="block">
      <div
        ref={tileRef}
        className="relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        {!emp.complete && (
          <div
            className="absolute right-5 top-4 z-20"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className="relative">
              <button
                type="button"
                aria-label="View incomplete record details"
                aria-expanded={open}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white ring-2 ring-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
              >
                i
              </button>

              {open && (
                <div
                  className={
                    "absolute z-50 w-[76vw] max-w-[260px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl ring-1 ring-black/5 sm:w-[300px] " +
                    (side === "right"
                      ? "left-full top-0 ml-2"
                      : side === "left"
                      ? "right-full top-0 mr-2"
                      : "right-0 top-6")
                  }
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <div className="mb-2 text-[12px] font-semibold text-gray-900 sm:mb-3 sm:text-[13px]">
                    Incomplete Records{" "}
                    <span className="font-bold text-rose-500">
                      ({emp.missingCount}/{emp.totalCount})
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs sm:space-y-3 sm:text-[13px]">
                    <details className="group" open>
                      <summary className="flex cursor-pointer select-none items-center justify-between rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gray-500 before:content-['']">
                          Employment Details
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="ml-7 mt-1 list-decimal space-y-1 pl-4 text-rose-600">
                        <li>Salary &amp; Compensation</li>
                      </ol>
                    </details>
                    <details className="group">
                      <summary className="flex cursor-pointer select-none items-center justify-between rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="relative pl-5 font-medium text-gray-800 before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gray-500 before:content-['']">
                          Document Repository
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="ml-7 mt-1 list-decimal space-y-1 pl-4 text-rose-600">
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

        {/* Avatar */}
        <div className="relative mx-auto h-24 w-24">
          <div
            className={`absolute inset-0 scale-110 rounded-full border-4 ${
              emp.complete ? "border-yellow-400" : "border-yellow-400 border-dashed"
            }`}
          />
          {isSvgAvatar ? (
            <div className="absolute inset-0 grid place-items-center rounded-full bg-white">
              <PlacholderPicture
                gender={emp.avatar as "male" | "female"}
                className="h-16 w-16"
                title={emp.name}
              />
            </div>
          ) : (
            <Image
              src={emp.avatar}
              alt={`${emp.name} ${emp.complete ? "– complete" : "– incomplete"}`}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          )}
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
                className="mx-auto h-2 w-40 overflow-hidden rounded-full bg-rose-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={emp.percent ?? 0}
                aria-label="Record completion"
              >
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
