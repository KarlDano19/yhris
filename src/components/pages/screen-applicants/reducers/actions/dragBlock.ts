import { ApplicantType, StageType } from "../../types"

export default function dragBlock(state: any, action: any) {
  const { source, destination } = action.payload
  if (!destination) {
    return state
  }

  // swapping blocks from source to destination
  const applicants = state.map((item: StageType) => [...item.applicants])
  const [movedApplicants] = applicants.splice(source.index, 1)
  applicants.splice(destination.index, 0, movedApplicants)
  const newState = state.map((stage: StageType, index: number) => {
    if (index === source.index || index === destination.index) {

      // reset applicants status first
      const newApplicants = applicants[index].map((applicant: ApplicantType) => ({...applicant, status: null}))
      return {...stage, applicants: newApplicants}
    } else {
      return {...stage, applicants: applicants[index]}
    }
  })
  return newState
}
