export default function Grid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        // roomier defaults
        "gap-x-6 gap-y-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}