export default function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <section>
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-indigo-dye">{title}</h3>
      )}
      {children}
    </section>
  );
}