type propsTypes = {
  children: React.ReactNode
  title: string
}

export default function Wrapper({ children, title }: propsTypes) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="p-2 md:p-8 lg:p-4">
        <h2 className="text-xl font-bold text-indigo-dye">{title}</h2>
        {children}
      </div>
    </div>
  )
}