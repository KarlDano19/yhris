import Wrapper from "@/components/layouts/Wrapper"
import PostJobCard from "./PostJobCard"
import data from "./testData"
import Link from "next/link"

export default function Content() {
  return (
    <Wrapper title="Screen Applicants">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {data.map((item, index) => {
          return (
            <Link
              href={`screen-applicants/${item.id}`}
              key={item.id}
              className="rounded-2xl p-8 shadow-md text-indigo-dye text-center bg-white"
            >
              <h2 className="font-semibold text-xl">{item.title}</h2>
              <p className="text-[15px] mb-8">{item.address}</p>
              <div className="bg-[#EAC645] rounded-lg font-semibold text-[15px] w-full py-4">
                <p>{item.applicants.length} New Applicant/s</p>
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
