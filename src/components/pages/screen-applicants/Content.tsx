import Wrapper from "@/components/layouts/Wrapper"
import { PlusIcon } from "@heroicons/react/24/outline"

export default function Content() {
  return (
    <Wrapper title="Screen Applicants">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        <div className="rounded-2xl p-8 shadow-md text-indigo-dye text-center">
          <h2 className="font-semibold text-xl">Accounting Officer</h2>
          <p className="text-[15px] mb-8">Cagayan de Oro City</p>
          <button
            type="button"
            className="bg-[#EAC645] hover:bg-[#e1bf42] rounded-lg font-semibold text-[15px] w-full py-4"
          >
            <p>2 New Applicant/s</p>
          </button>
        </div>
        <PostAJobCard />
        <PostAJobCard />
        <PostAJobCard />
        <PostAJobCard />
        <PostAJobCard />
      </div>
    </Wrapper>
  )
}

export function PostAJobCard() {
  return (
    <button
      type="button"
      className="rounded-2xl px-8 py-24 shadow-md text-[#CCE0FF] bg-[#EBF3FF] flex"
    >
      <div className="m-auto flex items-center gap-2">
        <PlusIcon className="h-8 w-8 font-bold" />
        <p className="font-bold text-3xl">Post a Job</p>
      </div>
    </button>
  )
}
