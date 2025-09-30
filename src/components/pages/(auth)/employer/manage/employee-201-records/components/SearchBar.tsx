import { memo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  value?: string;
  onChange: (v: string) => void;
};

function SearchBar({ value = "", onChange }: Props) {
  const [query, setQuery] = useState(value);

  const handleSearch = () => {
    onChange(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search…"
        className="flex-1 border border-gray-200 bg-white px-3 py-2.5 text-sm rounded-md outline-none ring-0 placeholder:text-gray-400 focus:border-[#355fd0]"
      />
      <button
        type="button"
        data-testid="search-btn"
        onClick={handleSearch}
        className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 hover:bg-gray-100"
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
}

export default memo(SearchBar);
