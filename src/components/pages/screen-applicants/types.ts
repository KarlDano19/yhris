import React, { Dispatch, ReactNode, SetStateAction } from "react"

export type StateType = StageType[]

export type BlockPropTypes = {
  stage: StageType
  index: number
  provided: any
  snapshot: any
}

export type WrapperPropTypes = {
  children: React.ReactNode
  maxWidth?: string
  title: string
  backText?: string
  backLink?: string
}

export type PersonPropTypes = {
  applicant: ApplicantType
  isOpenMenu: boolean
  setOpenMenuId: any
  stage: StageType
}

export type ModalLayoutTypes = {
  children: React.ReactNode
  title: string
  isOpen: boolean
  handleClose: any
}

export type StageRequirementsTypes = {
  title: string
  requirements: string[]
  handleFormSubmit: any
}

export type ScheduleInterviewPropTypes = {
  title: string
  handleFormSubmit: any
}

export type SendEmailPropTypes = {
  title: string
  handleFormSubmit: any
}

export type SuccessPropTypes = {
  title: string
}

export type ChecklistPropTypes = {
  title: string
  requirements: string[]
  handleFormSubmit: any
}

export type ApplicantType = {
  id: number
  image: string
  name: string
  checklists: string[]
  status: "ongoing" | "withdrawn" | "rejected" | "passed" | null | undefined
}

export type ApplicantsType = [] | ApplicantType[]

export type StageType = {
  id: number
  title: string
  isNewStage: boolean
  requirements: string[]
  applicants: ApplicantsType
}

export type ActionStateType = {
  modal: {
    whichModal: null | string
    isOpen: boolean
    title: string
  }
  stageId: number | null
  applicantId: number | null
}

export type StagePropTypes = {
  stage: StageType
  stageDropdownId: number | null
  setStageDropdownId: any
  setActionState: any
  dispatch: any
}

export type ContextTypes = {
  state: StateType
  dispatch: any
  actionState: any
  setActionState: any
}

export type ModalTypes = {
  STAGE_REQUIREMENTS: {
    component: ReactNode
    dispatch?: {
      type: string
      payload?: any
    }
  }
  CHECKLIST: {
    component: ReactNode
    dispatch?: {
      type: string
      payload?: any
    }
  }
  SEND_EMAIL: {
    component: ReactNode
    dispatch?: {
      type: string
      payload?: any
    }
  }
  SCHEDULE_INTERVIEW: {
    component: ReactNode
    dispatch?: {
      type: string
      payload?: any
    }
  }
  SUCCESS: {
    component: ReactNode
  }
  CONFIRMATION: {
    component: ReactNode
  }
}

export type StageHeaderTypes = {
  stage: StageType
  stageDropdownId: number | null
  setStageDropdownId: any
}

export type StageBlockTypes = {
  stage: StageType
  index: number
  openMenuId: number | null
  setOpenMenuId: any
}