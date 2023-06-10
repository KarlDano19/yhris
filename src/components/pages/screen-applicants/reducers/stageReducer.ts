import actionTypes from "../lib/actionTypes"
import { job } from "../testData"
import addStage from "./actions/addStage"
import checklist from "./actions/checklist"
import dragBlock from "./actions/dragBlock"
import removeStage from "./actions/removeStage"
import scheduleInterview from "./actions/scheduleInterview"
import sendEmail from "./actions/sendEmail"
import setRequirements from "./actions/setRequirements"
import setTitle from "./actions/setTitle"

const {
  STAGE_REQUIREMENTS,
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
    title: "Recommended Applicants",
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
    case DRAG_BLOCK: 
      return dragBlock(state, action)
    case SET_TITLE: 
      return setTitle(state, action)
    case STAGE_REQUIREMENTS: 
      return setRequirements(state, action)
    case ADD_STAGE: 
      return addStage(state)
    case REMOVE_STAGE: 
      return removeStage(state, action)
    case CHECKLIST: 
      return checklist(state, action)
    case SEND_EMAIL: 
      return sendEmail(state, action)
    case SCHEDULE_INTERVIEW: 
     return scheduleInterview(state, action)
    default:
      return state
  }
}
