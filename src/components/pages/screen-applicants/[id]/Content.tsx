"use client"

import Wrapper from "@/components/pages/screen-applicants/Wrapper"
import Block from "./Block"
import { SetStateAction, useState } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./StrictModeDroppable"
import Stage from "./Stage"
import "../styles.css"
import { job } from "../testData"
import StageRequirements from "./modals/StageRequirements"
import Checklist from "./modals/Checklist"
import ScheduleInterview from "./modals/ScheduleInterview"

export default function Content() {
  const [stages, setStages] = useState([
    {
      id: 1,
      title: "Recommended Applicants",
      requirements: [],
      applicants: job.applicants,
    },
    {
      id: 2,
      title: "Initial Interview",
      requirements: [],
      applicants: [],
    },
    {
      id: 3,
      title: "Manager Interview",
      requirements: [],
      applicants: [],
    },
    {
      id: 4,
      title: "Panel Interview",
      requirements: [],
      applicants: [],
    },
    {
      id: 5,
      title: "Final Interview",
      requirements: [],
      applicants: [],
    },
  ])
  const [stageDropdownId, setStageDropdownId] = useState(null)
  const [stageRequirementsId, setStageRequirementsId] = useState(null)
  const [personMenu, setPersonMenu] = useState(null)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const applicants = stages.map((stage) => [...stage.applicants])
    const [movedApplicants] = applicants.splice(source.index, 1)
    applicants.splice(destination.index, 0, movedApplicants)
    const newArr = stages.map((item, index) => ({
      ...item,
      applicants: applicants[index],
    }))
    setStages(newArr)
  }

  const handleStateRequirementsSubmit = (
    id: number,
    requirements: string[]
  ) => {
    const newStages = stages.map((stage) => {
      if (stage.id === id) {
        return { ...stage, requirements }
      } else return stage
    })
    setStages(newStages)
    setStageRequirementsId(null)
  }

  const handleChecklistSubmit = () => {
    setPersonMenu(null)
  }

  const handleSchedInterviewSubmit = () => {
    setPersonMenu(null)
  }

  const gridCols = { gridTemplateColumns: `repeat(${stages.length}, 300px)` }
  console.log()
  return (
    <Wrapper
      maxWidth="max-w-[1700px]"
      title={`Screen Applicants / ${job.title}`}
    >
      {stageRequirementsId !== null &&
        (() => {
          const { title, requirements } = stages.find(
            (stage) => stage.id === stageRequirementsId
          )
          return (
            <StageRequirements
              title={`Set-up Stage Requirements ${title}`}
              id={stageRequirementsId}
              setId={setStageRequirementsId}
              requirements={requirements}
              handleSubmit={handleStateRequirementsSubmit}
            />
          )
        })()}

      {personMenu?.whichModal === 1 && (
        <Checklist
          title="Checklist"
          id={personMenu}
          setId={setPersonMenu}
          requirements={
            stages.find((stage) => stage.id === personMenu.whichStage)
              .requirements
          }
          handleSubmit={handleChecklistSubmit}
        />
      )}

      {personMenu?.whichModal === 3 && (
        <ScheduleInterview
          title="Schedule Interview"
          id={personMenu}
          setId={setPersonMenu}
          handleSubmit={handleSchedInterviewSubmit}
        />
      )}

      <div className="flex justify-end">
        <button className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-8">
          ADD STAGE
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className={`grid gap-5 mb-4`} style={gridCols}>
          {stages?.map((stage) => (
            <Stage
              key={stage.id}
              stage={stage}
              stageDropdownId={stageDropdownId}
              setStageDropdownId={setStageDropdownId}
              setStageRequirementsId={setStageRequirementsId}
              stages={stages}
              setStages={setStages}
            />
          ))}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="stage" direction="horizontal">
            {(provided) => (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid gap-5 mb-4`}
                style={gridCols}
              >
                {stages.map((stage, index) => {
                  return (
                    <Block
                      key={stage.id}
                      index={index}
                      stage={stage}
                      setPersonMenu={setPersonMenu}
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
