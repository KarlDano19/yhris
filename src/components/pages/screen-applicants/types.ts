import React, { Dispatch, SetStateAction } from "react"

export type StateType = StageType[]

export type BlockPropTypes = {
  index: number
  stage: StageType
  setActionState: any
  openMenuId: null | number
  setOpenMenuId: any
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
  setActionState: any
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
  setActionState: any
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
