"use client"

import Wrapper from "@/components/layouts/Wrapper"
import data from "../testData"
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/outline"
import ColumnBlock from "../ColumnBlock"
import { useState } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../StrictModeDroppable"
import { useRouter } from "next/navigation"

const stageTitles = [
  "Recommended Applicants",
  "Initial Interview",
  "Manager Interview",
  "Final Interview",
]

export default function Content({ id }: { id: string | number }) {
  // todo navigate user to 404
  const router = useRouter()
  const job = data.find((item) => item.id === id)

  const [stages, setStages] = useState([
    {
      id: 1,
      applicants: job.applicants,
    },
    {
      id: 2,
      applicants: [],
    },
    {
      id: 3,
      applicants: [],
    },
    {
      id: 4,
      applicants: [],
    },
  ])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const items = Array.from(stages)
    const [newOrder] = items.splice(source.index, 1)
    items.splice(destination.index, 0, newOrder)
    setStages(items)
  }

  return (
    <Wrapper title={`Screen Applicants / ${job.title}`}>
      <div className="flex justify-end">
        <button className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-8">
          ADD STAGE
        </button>
      </div>

      <div className="min-w-[1150px]">
        <div className="grid grid-cols-4 gap-5 mb-4">
          {stageTitles.map((title) => {
            return (
              <div
                key={title}
                className="flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] text-center"
              >
                <span className="p-4">
                  <PencilIcon className="w-3" />
                </span>
                <p className="font-semibold text-[15px] text-indigo-dye">
                  {title}
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

        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="stage" direction="horizontal">
            {(provided) => (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-4 gap-5"
              >
                {stages?.map((stage, index) => {
                  const { applicants } = stage
                  return (
                    <ColumnBlock
                      applicants={applicants}
                      job={job}
                      key={stage.id}
                      draggableId={stage.id.toString()}
                      index={index}
                    />
                  )
                })}
                {provided.placeholder}
              </section>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
    </Wrapper>
  )
}
