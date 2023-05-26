"use client"

import Wrapper from "@/components/layouts/Wrapper"
import data from "../testData"
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"

export default function Content({ id }) {
  const obj = data.find((item) => item.id === id)
  const stages = [
    {
      id: 1,
      title: "Recommended Applicants",
      applicants: obj.applicants,
    },
    {
      id: 2,
      title: "Initial Interview",
      applicants: [],
    },
    {
      id: 3,
      title: "Manager Interview",
      applicants: [],
    },
    {
      id: 4,
      title: "Final Interview",
      applicants: [],
    },
  ]

  return (
    <Wrapper title={`Screen Applicants / ${obj.title}`}>
      <div className="flex justify-end">
        <button className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-8">
          ADD STAGE
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
        {stages.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] text-center"
            >
              <span className="p-4">
                <PencilIcon className="w-3" />
              </span>
              <p className="font-semibold text-[15px] text-indigo-dye">
                {item.title}
              </p>
              <button
                type="button"
                className="border border-[#ACB9CB] p-4 rounded-md"
              >
                <ChevronDownIcon className="w-5 text-[#355FD0]" />
              </button>
            </div>
          )
        })}
      </div>
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages?.map((stage) => {
          const { applicants } = stage
          return (
            <ul
              key={stage.id}
              className="bg-[#EBF3FF] rounded-2xl px-7 py-2 h-[500px] relative"
            >
              {applicants.length ? (
                applicants.map((applicant, index) => {
                  return (
                    <li
                      onDragStart={() => console.log("dragging")}
                      onDrop={() => console.log("dropped!")}
                      draggable
                      key={applicant.id}
                      className={`${
                        index !== obj.applicants.length - 1 &&
                        "border-b border-b-[#ACB9CB]"
                      } flex items-center py-6 gap-2`}
                    >
                      <div className="w-8 h-8 overflow-hidden rounded-full">
                        <Image
                          src={applicant.image}
                          alt={applicant.name}
                          width="50"
                          height="50"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-indigo-dye font-semibold text-sm">
                        {applicant.name}
                      </p>
                      <button type="button" className="ml-auto text-indigo-dye">
                        <EllipsisVerticalIcon className="w-7 h-7" />
                      </button>
                    </li>
                  )
                })
              ) : (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <PlusIcon className="text-[#CCE0FF] w-9 h-9" />
                </span>
              )}
            </ul>
          )
        })}
      </section>
    </Wrapper>
  )
}
