"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import PlacholderPicture from "@/svg/PlaceholderPicture"; 
import type { Employee } from "@/types/employee-201-records/employee";

export default function EmployeeTile({ emp }: { emp: Partial<Employee> }) {
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ---------- display helpers (API fields) ----------
  const displayName = `${emp.firstname ?? ""}${
    emp.lastname ? ` ${emp.lastname}` : ""
  }`.trim();
  const [imgError, setImgError] = useState(false);
  const rawGender = (emp.gender || "").toLowerCase();
  const photoUrl = emp.photo || undefined;
  const hasPhoto = !!photoUrl && photoUrl.trim() !== "";
  const showPhoto = hasPhoto && !imgError;
  const placeholderGender: "male" | "female" =
    rawGender === "female" ? "female" : "male";

  const complete = !!emp.hasCompleteRecords;
  const percent =
    typeof emp.progressPercentage === "number" ? emp.progressPercentage : 0;
  const missingCount = emp.incompleteRecords?.count ?? 0;
  // --------------------------------------------------

  return (
    <Link href={`/manage/employee-201-records/${emp.id}`} className="block">
      <div
        ref={tileRef}
        className="relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        {!complete && (
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
                      ({missingCount})
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs sm:space-y-3 sm:text-[13px]">
                    {emp.incompleteRecords?.missing?.map((section, idx) => (
                      <details key={idx} className="group" open={idx === 0}>
                        <summary className="flex cursor-pointer select-none items-center justify-between rounded-md px-1 py-1.5 [&::-webkit-details-marker]:hidden">
                          <span className="relative pl-5 font-medium text-gray-800 before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gray-500 before:content-['']">
                            {section.name}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                        </summary>
                        <ol className="ml-7 mt-1 list-decimal space-y-1 pl-4 text-rose-600">
                          {section.items.map((item, j) => (
                            <li key={j}>
                              {item.name}
                              {item.missing && item.missing.length > 0 && (
                                <span className="ml-1 text-gray-500">
                                  ({item.missing.join(", ")})
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Avatar (gender/photo from API) */}
        <div className="relative mx-auto h-24 w-24">
          <div
            className={`absolute inset-0 scale-110 rounded-full border-4 ${
              complete ? "border-yellow-400" : "border-yellow-400 border-dashed"
            }`}
          />
          {showPhoto ? (
            <Image
              src={photoUrl!}
              alt={`${displayName || "Employee"} ${
                complete ? "– complete" : "– incomplete"
              }`}
              width={96}
              height={96}
              className="absolute inset-0 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center rounded-full bg-white">
              <PlacholderPicture
                gender={placeholderGender}
                className="h-16 w-16"
                title={displayName || "Employee"}
              />
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <div className="text-sm font-semibold text-gray-8 00">
            {displayName || "\u00A0"}
          </div>
          {complete ? (
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
                aria-valuenow={percent}
                aria-label="Record completion"
              >
                <div
                  className="h-full bg-rose-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] font-medium text-rose-600">
                Incomplete Records
                {typeof percent === "number" ? ` • ${percent}%` : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
