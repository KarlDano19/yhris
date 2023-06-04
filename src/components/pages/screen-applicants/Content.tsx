import Wrapper from "@/components/pages/screen-applicants/Wrapper"
import PostJobCard from "./PostJobCard"
import { data } from "./testData"
import Link from "next/link"

export default function Content() {
  return (
    <Wrapper title="Screen Applicants" backLink="/" backText="Home">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((item) => {
          const { title, address, applicants } = item

          return (
            <Link
              href={`screen-applicants/${item.id}`}
              key={item.id}
              className="rounded-lg p-8 shadow-sm text-indigo-dye text-center bg-white"
            >
              <h2 className="font-semibold text-xl">{title}</h2>
              <p className="text-[15px] mb-8">{address}</p>
              <div className="bg-[#EAC645] rounded-lg font-semibold text-[15px] w-full py-4">
                <p>{applicants.length} New Applicant/s</p>
              </div>
            </Link>
          )
        })}

        {/* ensuring cards displayed are always six */}
        {Array.from({ length: 6 - data.length }).map((_, index) => {
          return <PostJobCard key={index} />
        })}
      </div>
    </Wrapper>
  )
}
