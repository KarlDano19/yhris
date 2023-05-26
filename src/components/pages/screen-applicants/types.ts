export type ApplicantsType =
  | []
  | {
      id: number
      image: string
      name: string
    }[]

export type JobType = {
  id: number
  title: string
  address: string
  applicants: ApplicantsType
}

export type PropTypes = {
  applicants: ApplicantsType
  job: JobType
  key: number
  draggableId: string
  index: number
}