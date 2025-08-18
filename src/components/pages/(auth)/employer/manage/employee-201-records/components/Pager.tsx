import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = { page: number; totalPages: number; onPrev: () => void; onNext: () => void };
export default function Pager({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <nav className="flex items-center gap-1">
      <button onClick={onPrev} disabled={page === 1} className="rounded-full p-2 disabled:opacity-40 hover:bg-gray-100" aria-label="Previous page">
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <div className="min-w-[2.5rem] text-center text-sm text-gray-700">{page} / {totalPages}</div>
      <button onClick={onNext} disabled={page === totalPages} className="rounded-full p-2 disabled:opacity-40 hover:bg-gray-100" aria-label="Next page">
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}