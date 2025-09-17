export default function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
          <div className="mt-3 h-4 w-32 mx-auto rounded bg-gray-200 animate-pulse" />
          <div className="mt-3 h-6 w-40 mx-auto rounded-full bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}