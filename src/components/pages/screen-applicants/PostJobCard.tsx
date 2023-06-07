import { PlusIcon } from "@heroicons/react/24/outline"

export default function PostJobCard() {
  return (
    <button
      type="button"
      className="rounded-lg px-8 py-24 shadow-md text-[#CCE0FF] bg-[#EBF3FF] flex"
    >
      <div className="m-auto flex items-center gap-2">
        <PlusIcon className="h-8 w-8 font-bold" />
        <p className="font-bold text-xl">Post a Job</p>
      </div>
    </button>
  )
}
