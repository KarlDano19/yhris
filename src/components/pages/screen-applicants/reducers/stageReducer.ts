import actionTypes from "../lib/actionTypes"
import { initialActionState } from "../lib/initialActionState"
import { job } from "../testData"
import { StageType } from "../types"

const {
  SET_REQUIREMENTS,
  CHECKLIST,
  SEND_EMAIL,
  SCHEDULE_INTERVIEW,
  DRAG_BLOCK,
  SET_TITLE,
  REMOVE_STAGE,
  ADD_STAGE,
} = actionTypes

export const INITIAL_STATE = [
  {
    id: 1,
    title: "Recommended Applicant",
    isNewStage: false,
    requirements: [],
    applicants: job.applicants,
  },
  {
    id: 2,
    title: "Initial Interview",
    isNewStage: false,
    requirements: [],
    applicants: [],
  },
  {
    id: 3,
    title: "Manager Interview",
    isNewStage: false,
    requirements: [],
    applicants: [],
  },
  {
    id: 4,
    title: "Panel Interview",
    isNewStage: false,
    requirements: [],
    applicants: [],
  },
  {
    id: 5,
    title: "Final Interview",
    isNewStage: false,
    requirements: [],
    applicants: [],
  },
]

export const stageReducer = (state: any, action: any) => {
  switch (action.type) {
    case DRAG_BLOCK: {
      const { source, destination } = action.payload
      console.log({ source, destination })
      if (!destination) {
        return state
      }
      const applicants = state.map((item: StageType) => [...item.applicants])
      const [movedApplicants] = applicants.splice(source.index, 1)
      applicants.splice(destination.index, 0, movedApplicants)
      const newState = state.map((item: StageType, index: number) => ({
        ...item,
        applicants: applicants[index],
      }))
      return newState
    }
    case SET_TITLE: {
      const { title, stageId } = action.payload
      console.log({ title, stageId })
      const newState = state.map((item: StageType) => {
        if (item.id === stageId) {
          return { ...item, title }
        } else return item
      })
      return newState
    }
    case SET_REQUIREMENTS: {
      const { actionState, setActionState, requirements } = action.payload
      const newState = state.map((item: StageType) => {
        if (item.id === actionState.stageId) {
          return { ...item, requirements }
        } else return item
      })
      setActionState({
        ...actionState,
        modal: {
          whichModal: "SUCCESS",
          isOpen: true,
          title: "You have successfully set-up your stage requirements.",
        },
      })
      return newState
    }
    case ADD_STAGE: {
      const newState = [...state]
      newState.push({
        id: Date.now(),
        title: "Untitled",
        isNewStage: true,
        requirements: [],
        applicants: [],
      })
      return newState
    }
    case REMOVE_STAGE: {
      const { stageId, setActionState } = action.payload
      const newState = state.filter((item: StageType) => item.id !== stageId)
      setActionState(initialActionState)
      return newState
    }
    case CHECKLIST: {
      const { actionState, setActionState, formData } = action.payload
      // checklist logic here...
      setActionState({
        ...actionState,
        modal: {
          whichModal: "SUCCESS",
          isOpen: true,
          title: "You have successfully updated checklist.",
        },
      })
      return state
    }

    case SEND_EMAIL: {
      const { actionState, setActionState, formData } = action.payload
      // send email logic here...
      console.log(formData)
      setActionState({
        ...actionState,
        modal: {
          whichModal: "SUCCESS",
          isOpen: true,
          title: "You have successfully sent an email.",
        },
      })
      return state
    }
    case SCHEDULE_INTERVIEW: {
      const { actionState, setActionState, formData } = action.payload
      // schedule interview logic here...
      setActionState({
        ...actionState,
        modal: {
          whichModal: "SUCCESS",
          isOpen: true,
          title: "You have successfully sent interview request.",
        },
      })
      return state
    }
    default:
      return state
  }
}
