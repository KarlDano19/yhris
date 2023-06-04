export default function ModalFooterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 text-[15px] font-bold justify-end flex-wrap p-4">
      {children}
    </div>
  )
}
