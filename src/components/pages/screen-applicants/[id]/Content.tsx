"use client"

import Wrapper from "@/components/pages/screen-applicants/Wrapper"
import Block from "./Block"
import { useReducer, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./StrictModeDroppable"
import Stage from "./Stage"
import "../styles.css"
import { job } from "../testData"
import StageRequirements from "./modals/StageRequirements"
import Checklist from "./modals/Checklist"
import ScheduleInterview from "./modals/ScheduleInterview"
import SendEmail from "./modals/SendEmail"
import Confirmation from "./modals/Confirmation"
import Success from "./modals/Success"
import { INITIAL_STATE, stageReducer } from "../reducers/stageReducer"
import { initialActionState } from "../lib/initialActionState"
import { StageType } from "../types"

export default function Content() {
  const [state, dispatch] = useReducer(stageReducer, INITIAL_STATE)
  const [actionState, setActionState] = useState(initialActionState)
  const [stageDropdownId, setStageDropdownId] = useState(null)

  const handleFormSubmit = (data: any) => {
    switch (actionState.modal.whichModal) {
      case "STAGE_REQUIREMENTS":
        dispatch({
          type: "SET_REQUIREMENTS",
          payload: {
            actionState,
            setActionState,
            requirements: data,
          },
        })
        break
      case "CHECKLIST":
        dispatch({
          type: "CHECKLIST",
          payload: {
            actionState,
            setActionState,
            formData: data,
          },
        })
        break
      case "SEND_EMAIL":
        dispatch({
          type: "SEND_EMAIL",
          payload: {
            actionState,
            setActionState,
            formData: data,
          },
        })
        break
      case "SCHEDULE_INTERVIEW":
        dispatch({
          type: "SCHEDULE_INTERVIEW",
          payload: {
            actionState,
            setActionState,
            formData: data,
          },
        })
        break
      default:
        setActionState(initialActionState)
    }
  }

  const { whichModal, isOpen, title } = actionState.modal
  const requirements =
    state.find((item: StageType) => item.id === actionState.stageId)
      ?.requirements || null
  const gridCols = { gridTemplateColumns: `repeat(${state.length}, 300px)` }

  return (
    <Wrapper
      maxWidth="max-w-[1700px]"
      title={`Screen Applicants / ${job.title}`}
    >
      {whichModal === "STAGE_REQUIREMENTS" && (
        <StageRequirements
          title={title}
          requirements={requirements}
          setActionState={setActionState}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      {whichModal === "CHECKLIST" && (
        <Checklist
          title={title}
          requirements={requirements}
          setActionState={setActionState}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      {whichModal === "SEND_EMAIL" && (
        <SendEmail
          title={title}
          setActionState={setActionState}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      {whichModal === "SCHEDULE_INTERVIEW" && (
        <ScheduleInterview
          title={title}
          setActionState={setActionState}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      {whichModal === "SUCCESS" && (
        <Success title={title} setActionState={setActionState} />
      )}
      {whichModal === "WARNING" && (
        <Confirmation
          actionState={actionState}
          setActionState={setActionState}
          dispatch={dispatch}
        />
      )}

      <div className="flex justify-end">
        <button className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-8">
          ADD STAGE
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className={`grid gap-5 mb-4`} style={gridCols}>
          {state.map((stage: StageType) => (
            <Stage
              key={stage.id}
              stage={stage}
              state={state}
              stageDropdownId={stageDropdownId}
              setStageDropdownId={setStageDropdownId}
              setActionState={setActionState}
            />
          ))}
        </div>

        <DragDropContext
          onDragEnd={(result) =>
            dispatch({ type: "DRAG_BLOCK", payload: result })
          }
        >
          <StrictModeDroppable droppableId="stage" direction="horizontal">
            {(provided) => (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid gap-5 mb-4`}
                style={gridCols}
              >
                {state.map((stage: StageType, index: number) => {
                  return (
                    <Block
                      key={stage.id}
                      index={index}
                      stage={stage}
                      setActionState={setActionState}
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
