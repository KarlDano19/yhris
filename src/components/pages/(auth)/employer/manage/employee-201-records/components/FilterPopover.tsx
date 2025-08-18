import { useEffect, useState } from "react";
import { FunnelIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type FilterValues = {
  location: string;
  department: string;
  position: string;
  onlyIncomplete: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  // initial (applied) values from Content
  initial: FilterValues;
  onApply: (vals: FilterValues) => void;
};

export default function FilterPopover({ open, onOpenChange, initial, onApply }: Props) {
  const [draft, setDraft] = useState<FilterValues>(initial);

  useEffect(() => {
    if (open) setDraft(initial); // reset draft to current applied values on open
  }, [open, initial]);

  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm rounded-md hover:bg-gray-50"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FunnelIcon className="h-5 w-5 text-gray-700" />
        <span className="text-gray-800 font-medium">Filter</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Employee filters"
          className="absolute z-40 mt-3 right-0 w-[75vw] max-w-[260px] sm:w-[420px] sm:max-w-none rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
            {/* Location */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">Location</label>
              <div className="relative">
                <select
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                >
                  <option>ALL</option>
                  <option>Manila</option>
                  <option>Cebu</option>
                  <option>Davao</option>
                  <option>Unspecified</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">Department</label>
              <div className="relative">
                <select
                  value={draft.department}
                  onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                >
                  <option>ALL</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Unspecified</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">Position</label>
              <div className="relative">
                <select
                  value={draft.position}
                  onChange={(e) => setDraft((d) => ({ ...d, position: e.target.value }))}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 sm:py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                >
                  <option>ALL</option>
                  <option>Associate</option>
                  <option>Manager</option>
                  <option>Director</option>
                  <option>Unspecified</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-indigo-dye/70" />
              </div>
            </div>

            {/* Only Incomplete */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#355fd0] focus:ring-[#355fd0]"
                checked={draft.onlyIncomplete}
                onChange={(e) => setDraft((d) => ({ ...d, onlyIncomplete: e.target.checked }))}
              />
              Show only incomplete
            </label>

            {/* Footer */}
            <div className="pt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setDraft({ location: "ALL", department: "ALL", position: "ALL", onlyIncomplete: false })}
                className="rounded-lg border border-[#355fd0] bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/10"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onApply(draft);     // <-- apply to API params only now
                  onOpenChange(false);
                }}
                className="rounded-lg bg-[#355fd0] px-5 py-1.5 sm:px-6 sm:py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90"
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
