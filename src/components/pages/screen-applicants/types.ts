import React, { Dispatch, SetStateAction } from "react"

export type ApplicantType = {
  id: number
  image: string
  name: string
}

export type ApplicantsType = [] | ApplicantType[]

export type JobType = {
  id: number
  title: string
  address: string
  applicants: ApplicantsType
}

export type StageType = {
  id: number
  applicants: ApplicantsType
  title: string
  requirements: string[]
}

export type BlockPropTypes = {
  key: number
  applicants: ApplicantsType
  draggableId: string
  index: number
  stage: StageType
  setPersonMenu: Dispatch<SetStateAction<object | null>>
}

export type WrapperPropTypes = {
  children: React.ReactNode
  maxWidth: string
  title: string
}

export type StagePropTypes = {
  stage: StageType
  stageDropdownId: number
  setStageDropdownId: Dispatch<SetStateAction<number | null>>
  setStageRequirementsId: Dispatch<SetStateAction<number | null>>
  stages: StageType[]
  setStages: Dispatch<SetStateAction<{}[]>>
}

export type PersonPropTypes = {
  applicant: ApplicantType
  isOpenMenu: boolean
  setOpenMenuId: any
}

export type ModalLayoutTypes = {
  children: React.ReactNode
  title: string
  setModal: Dispatch<SetStateAction<number | null>>
}

export type StageRequirementsTypes = {
  title: string
  id: number
  setId: Dispatch<SetStateAction<number | null>>
  requirements: string[]
  handleSubmit: any
}

export type ScheduleInterviewPropTypes = {
  title: string
  id: number
  setId: Dispatch<SetStateAction<number | null>>
  handleSubmit: any
}

export type ChecklistPropTypes = {
  title: string
  id: number
  setId: Dispatch<SetStateAction<number | null>>
  requirements: string[]
  handleSubmit: any
}
