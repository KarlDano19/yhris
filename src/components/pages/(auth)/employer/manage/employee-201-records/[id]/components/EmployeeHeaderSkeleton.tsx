import Skeleton from "../common/Skeleton";

export default function EmployeeHeaderSkeleton() {
  return (
    <div data-testid="profile-header-loading" className="rounded-[40px] px-2 py-4 bg-[#355fd0]/5 sm:rounded-[110px] sm:px-8 sm:py-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0">
        <div className="flex w-full md:w-auto justify-center md:justify-start items-center gap-4 md:pr-5 text-center md:text-left">
          <div className="relative flex-shrink-0">
            <Skeleton className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-2 w-48" />
          </div>
        </div>
        <div className="hidden md:block h-24 w-[4px] rounded-full bg-gray-200" />
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}