import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { memo } from "react";

type Props = { value: string; onChange: (v: string) => void };
function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-md">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        className="w-full border border-gray-200 bg-white pl-3 pr-10 py-2.5 text-sm rounded-md outline-none ring-0 placeholder:text-gray-400 focus:border-[#355fd0]"
      />
      <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}
export default memo(SearchBar);