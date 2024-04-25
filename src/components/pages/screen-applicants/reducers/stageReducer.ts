import actionTypes from "../lib/actionTypes"
import setOnboarding from "./actions/setOnboarding"
import addStage from "./actions/addStage"
import checklist from "./actions/checklist"
import dragBlock from "./actions/dragBlock"
import removeStage from "./actions/removeStage"
import scheduleInterview from "./actions/scheduleInterview"
import sendEmail from "./actions/sendEmail"
import setRequirements from "./actions/setRequirements"
import setTitle from "./actions/setTitle"
import setApplicant from "./actions/setApplicant"
import clearStage from "./actions/clearStage";

const {
  CLEAR_STAGE,
  STAGE_REQUIREMENTS,
  CHECKLIST,
  SEND_EMAIL,
  SCHEDULE_INTERVIEW,
  DRAG_BLOCK,
  SET_TITLE,
  REMOVE_STAGE,
  ADD_STAGE,
  SET_ONBOARDING,
  SET_APPLICANT,
} = actionTypes

export const INITIAL_STATE = []

export const stageReducer = (state: any, action: any) => {
  switch (action.type) {
    case CLEAR_STAGE:
      return clearStage()
    case SET_ONBOARDING:
      return setOnboarding(action)
    case SET_APPLICANT:
      return setApplicant(state, action)
    case DRAG_BLOCK: 
      return dragBlock(state, action)
    case SET_TITLE: 
      return setTitle(state, action)
    case STAGE_REQUIREMENTS: 
      return setRequirements(state, action)
    case ADD_STAGE: 
      return addStage(state, action)
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
