"use client"

import Wrapper from "@/components/pages/screen-applicants/Wrapper"
import Block from "./Block"
import { useEffect, useReducer, useRef, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../layouts/StrictModeDroppable"
import Stage from "./Stage"
import "../styles.css"
import { job } from "../testData"
import StageRequirements from "../modals/StageRequirements"
import Checklist from "../modals/Checklist"
import ScheduleInterview from "../modals/ScheduleInterview"
import SendEmail from "../modals/SendEmail"
import Confirmation from "../modals/Confirmation"
import Success from "../modals/Success"
import { INITIAL_STATE, stageReducer } from "../reducers/stageReducer"
import { initialActionState } from "../lib/initialActionState"
import { StageType } from "../types"
import actionTypes from "../lib/actionTypes"
import StateContext from "../contexts/StateContext"

export default function Content() {
  const [state, dispatch] = useReducer(stageReducer, INITIAL_STATE)
  const [actionState, setActionState] = useState(initialActionState)
  const [stageDropdownId, setStageDropdownId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // closes dropdowns & menus after showing modals
    setStageDropdownId(null)
    setOpenMenuId(null)
  }, [actionState.modal.isOpen])

  const handleAddStage = () => {
    const { current: element } = containerRef
    dispatch({ type: "ADD_STAGE" })
    setTimeout(() => {
      if (element !== null) element.scrollLeft = element.scrollWidth
    }, 10)
  }
  

  const handleFormSubmit = (data: any) => {
    if (!actionState.modal.whichModal) return
    const { SET_REQUIREMENTS, CHECKLIST, SEND_EMAIL, SCHEDULE_INTERVIEW } =
      actionTypes

    switch (actionState.modal.whichModal) {
      case "STAGE_REQUIREMENTS":
        dispatch({
          type: SET_REQUIREMENTS,
          payload: {
            actionState,
            setActionState,
            requirements: data,
          },
        })
        break
      case "CHECKLIST":
        dispatch({
          type: CHECKLIST,
          payload: {
            actionState,
            setActionState,
            formData: data,
          },
        })
        break
      case "SEND_EMAIL":
        dispatch({
          type: SEND_EMAIL,
          payload: {
            actionState,
            setActionState,
            formData: data,
          },
        })
        break
      case "SCHEDULE_INTERVIEW":
        dispatch({
          type: SCHEDULE_INTERVIEW,
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
  const gridCols = { gridTemplateColumns: `repeat(${state?.length}, 300px)` }
  const requirements = state.find(
    (item: StageType) => item.id === actionState.stageId
  )?.requirements

  return (
    <StateContext.Provider value={{state, dispatch, actionState, setActionState}}>
      <Wrapper title={`Screen Applicants / ${job.title} Applications`} backLink="/screen-applicants" backText="Screen Applicants">
        {whichModal === "STAGE_REQUIREMENTS" && (
          <StageRequirements
            title={title}
            requirements={requirements}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {whichModal === "CHECKLIST" && (
          <Checklist
            title={title}
            requirements={requirements}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {whichModal === "SEND_EMAIL" && (
          <SendEmail
            title={title}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {whichModal === "SCHEDULE_INTERVIEW" && (
          <ScheduleInterview
            title={title}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {whichModal === "SUCCESS" && (
          <Success title={title} setActionState={setActionState} />
        )}
        {whichModal === "WARNING" && (
          <Confirmation/>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleAddStage}
            className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-6"
          >
            ADD STAGE
          </button>
        </div>

        <DragDropContext
          onDragEnd={(result) =>
            dispatch({ type: actionTypes.DRAG_BLOCK, payload: result })
          }
        >
          <StrictModeDroppable droppableId="stage" direction="horizontal">
            {(provided) => (
              <section
                {...provided.droppableProps}
                className="grid gap-5 mb-4 overflow-auto"
                style={gridCols}
                ref={(el) => {
                  provided.innerRef(el)
                  containerRef.current = el
                }}
              >
                {state.map((stage: StageType) => (
                  <Stage
                    key={stage.id}
                    stage={stage}
                    stageDropdownId={stageDropdownId}
                    setStageDropdownId={setStageDropdownId}
                    setActionState={setActionState}
                    dispatch={dispatch}
                  />
                ))}
                {state.map((stage: StageType, index: number) => {
                  return (
                    <Block
                      key={stage.id}
                      index={index}
                      stage={stage}
                      setActionState={setActionState}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                    />
                  )
                })}
                {provided.placeholder}
              </section>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Wrapper>
    </StateContext.Provider>
  )
}
