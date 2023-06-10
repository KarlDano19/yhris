"use client"

import Wrapper from "@/components/pages/screen-applicants/Wrapper"
import React, { useReducer, useRef, useState } from "react"
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
import { ModalTypes, StageType } from "../types"
import actionTypes from "../lib/actionTypes"
import StateContext from "../contexts/StateContext"
import AddStageBtn from "./AddStageBtn"
import DragAndDrop from "./DragAndDrop"

type ModalSelectedTypes = {
  component: React.ReactNode
  dispatch?: {
    type: string
    payload?: any
  }
}

export default function Content() {
  const {
    STAGE_REQUIREMENTS,
    CHECKLIST,
    SEND_EMAIL,
    SCHEDULE_INTERVIEW,
    ADD_STAGE,
  } = actionTypes
  const [state, dispatch] = useReducer(stageReducer, INITIAL_STATE)
  const [actionState, setActionState] = useState(initialActionState)
  const { title, whichModal } = actionState.modal
  const gridCols = { gridTemplateColumns: `repeat(${state?.length}, 300px)` }
  const containerRef = useRef<HTMLElement | null>(null)
  const requirements = state.find((item: StageType) => {
    return item.id === actionState.stageId
  })?.requirements

  const handleFormSubmit = (data: any) => {
    if (whichModal) {
      const modalSelected: ModalSelectedTypes = modals[whichModal]
      if (!modalSelected.dispatch) return

      modalSelected.dispatch.payload.formData = data
      dispatch(modalSelected.dispatch)
    }
  }

  const modals: ModalTypes = {
    STAGE_REQUIREMENTS: {
      component: (
        <StageRequirements
          title={title}
          requirements={requirements}
          handleFormSubmit={handleFormSubmit}
        />
      ),
      dispatch: {
        type: STAGE_REQUIREMENTS,
        payload: { actionState, setActionState },
      },
    },
    CHECKLIST: {
      component: (
        <Checklist
          title={title}
          requirements={requirements}
          handleFormSubmit={handleFormSubmit}
        />
      ),
      dispatch: {
        type: CHECKLIST,
        payload: { actionState, setActionState },
      },
    },
    SEND_EMAIL: {
      component: (
        <SendEmail title={title} handleFormSubmit={handleFormSubmit} />
      ),
      dispatch: {
        type: SEND_EMAIL,
        payload: { actionState, setActionState },
      },
    },
    SCHEDULE_INTERVIEW: {
      component: (
        <ScheduleInterview title={title} handleFormSubmit={handleFormSubmit} />
      ),
      dispatch: {
        type: SCHEDULE_INTERVIEW,
        payload: { actionState, setActionState },
      },
    },
    SUCCESS: {
      component: <Success title={title} />,
    },
    CONFIRMATION: {
      component: <Confirmation />,
    },
  }

  const handleAddStage = () => {
    const { current: element } = containerRef
    dispatch({ type: ADD_STAGE })
    setTimeout(() => {
      if (element !== null) element.scrollLeft = element.scrollWidth
    }, 10)
  }

  return (
    <StateContext.Provider
      value={{ state, dispatch, actionState, setActionState }}
    >
      <Wrapper
        title={`Screen Applicants / ${job.title} Applications`}
        backLink="/screen-applicants"
        backText="Screen Applicants"
      >
        {whichModal && modals[whichModal].component}

        <div className="flex justify-end">
          <AddStageBtn handleAddStage={handleAddStage} />
        </div>

        <DragAndDrop containerRef={containerRef} gridCols={gridCols} />
      </Wrapper>
    </StateContext.Provider>
  )
}
