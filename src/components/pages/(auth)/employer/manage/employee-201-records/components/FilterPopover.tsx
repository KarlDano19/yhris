import { useEffect, useMemo, useState } from "react";

import useGetLocationItems from "@/components/hooks/useGetLocationItems";
import useGetDepartmentItems from "@/components/hooks/useGetDepartmentItems";
import useGetPositionItems from "@/components/hooks/useGetPositionItems";

import SelectChevronDown from "@/svg/SelectChevronDown";
import FilterIcon from "@/svg/FilterIcon";

type FilterValues = {
  location: string;
  department: string;
  position: string;
  recordStatus: string;
  isActive: string[];
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: FilterValues;
  onApply: (vals: FilterValues) => void;
};

type ApiItem = { id: number; name: string };
type Option = { value: string; label: string };

const toOptions = (items?: ApiItem[], includeUnspecified = false): Option[] => {
  const base: Option[] = [{ value: "ALL", label: "ALL" }];
  const dynamic: Option[] = (items ?? [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((it) => ({ value: it.name, label: it.name }));
  const tail: Option[] = includeUnspecified
    ? [{ value: "Unspecified", label: "Unspecified" }]
    : [];
  const seen = new Set<string>();
  return [...base, ...dynamic, ...tail].filter((o) => {
    if (seen.has(o.value)) return false;
    seen.add(o.value);
    return true;
  });
};

const ensureValue = (value: string, options: Option[]) =>
  options.some((o) => o.value === value) ? value : "ALL";

export default function FilterPopover({
  open,
  onOpenChange,
  initial,
  onApply,
}: Props) {
  const [draft, setDraft] = useState<FilterValues>(initial);

  // locations
  const {
    data: locationItems = [],
    isLoading: isLocLoading,
    isError: isLocError,
    error: locError,
  } = useGetLocationItems();

  // departments
  const {
    data: departmentItems = [],
    isLoading: isDeptLoading,
    isError: isDeptError,
    error: deptError,
  } = useGetDepartmentItems();

  // positions
  const {
    data: positionItems = [],
    isLoading: isPosLoading,
    isError: isPosError,
    error: posError,
  } = useGetPositionItems();

  const locationOptions = useMemo(
    () => toOptions(locationItems as ApiItem[]),
    [locationItems]
  );
  const departmentOptions = useMemo(
    () => toOptions(departmentItems as ApiItem[]),
    [departmentItems]
  );
  const positionOptions = useMemo(
    () => toOptions(positionItems as ApiItem[]),
    [positionItems]
  );

  // Static options for Record Status
  const recordStatusOptions: Option[] = useMemo(
    () => [
      { value: "ALL", label: "ALL" },
      { value: "complete", label: "Complete" },
      { value: "incomplete", label: "Incomplete" },
    ],
    []
  );

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const anyLoading = isLocLoading || isDeptLoading || isPosLoading;

  return (
    <div className="relative">
      <button
        data-testid="filter-btn"
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm rounded-md hover:bg-gray-50"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FilterIcon />
        <span className="text-gray-800 font-medium text-[16px]">Filter</span>
      </button>

      {open && (
        <div
          data-testid="filter-dialog"
          role="dialog"
          aria-label="Employee filters"
          className="absolute z-40 mt-3 right-0 w-[75vw] max-w-[260px] sm:w-[420px] sm:max-w-none rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
            {/* Location */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                Location
              </label>
              <div className="relative">
                <select
                  data-testid="select-location"
                  value={ensureValue(draft.location, locationOptions)}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, location: e.target.value }))
                  }
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60"
                  disabled={anyLoading}
                  aria-busy={isLocLoading}
                  aria-invalid={isLocError || undefined}
                >
                  {locationOptions.map((opt) => (
                    <option key={`loc-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SelectChevronDown />
                </div>
              </div>
              {isLocError && (
                <p className="mt-1 text-xs text-red-600">
                  {(locError as any)?.message ??
                    String(locError) ??
                    "Failed to load locations."}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                Department
              </label>
              <div className="relative">
                <select
                  data-testid="select-department"
                  value={ensureValue(draft.department, departmentOptions)}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, department: e.target.value }))
                  }
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60"
                  disabled={anyLoading}
                  aria-busy={isDeptLoading}
                  aria-invalid={isDeptError || undefined}
                >
                  {departmentOptions.map((opt) => (
                    <option key={`dept-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SelectChevronDown />
                </div>
              </div>
              {isDeptError && (
                <p className="mt-1 text-xs text-red-600">
                  {(deptError as any)?.message ??
                    String(deptError) ??
                    "Failed to load departments."}
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                Position
              </label>
              <div className="relative">
                <select
                  data-testid="select-position"
                  value={ensureValue(draft.position, positionOptions)}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, position: e.target.value }))
                  }
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60"
                  disabled={anyLoading}
                  aria-busy={isPosLoading}
                  aria-invalid={isPosError || undefined}
                >
                  {positionOptions.map((opt) => (
                    <option key={`pos-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SelectChevronDown />
                </div>
              </div>
              {isPosError && (
                <p className="mt-1 text-xs text-red-600">
                  {(posError as any)?.message ??
                    String(posError) ??
                    "Failed to load positions."}
                </p>
              )}
            </div>

            {/* Record Status */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                Record Status
              </label>
              <div className="relative">
                <select
                  data-testid="select-record-status"
                  value={ensureValue(draft.recordStatus, recordStatusOptions)}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      recordStatus: e.target.value as FilterValues["recordStatus"],
                    }))
                  }
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60"
                  disabled={anyLoading}
                >
                  {recordStatusOptions.map((opt) => (
                    <option key={`rec-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SelectChevronDown />
                </div>
              </div>
            </div>

            {/* Employee Status - Active/Inactive */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                Employee Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={draft.isActive.includes('true')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDraft((d) => {
                        const newIsActive = checked
                          ? [...d.isActive, 'true']
                          : d.isActive.filter(v => v !== 'true');
                        return { ...d, isActive: newIsActive };
                      });
                    }}
                    className="h-4 w-4 text-[#355fd0] focus:ring-[#355fd0] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={draft.isActive.includes('false')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDraft((d) => {
                        const newIsActive = checked
                          ? [...d.isActive, 'false']
                          : d.isActive.filter(v => v !== 'false');
                        return { ...d, isActive: newIsActive };
                      });
                    }}
                    className="h-4 w-4 text-[#355fd0] focus:ring-[#355fd0] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                data-testid="reset-btn"
                onClick={() =>
                  setDraft({
                    location: "ALL",
                    department: "ALL",
                    position: "ALL",
                    recordStatus: "ALL",
                    isActive: ["true"],
                  })
                }
                className="rounded-lg border border-[#355fd0] bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/10"
              >
                Reset
              </button>
              <button
                data-testid="search-btn"
                onClick={() => {
                  onApply(draft);
                  onOpenChange(false);
                }}
                className="rounded-lg bg-[#355fd0] px-5 py-1.5 sm:px-6 sm:py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-60"
                disabled={anyLoading}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
