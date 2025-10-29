import { ApplicantType, StageType } from "../../types";

export default function checklist(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload;
  const stageIndex = state.findIndex((stage: StageType) => stage.id === actionState.stageId);
  const isNotLastStage = state.length - 1 !== stageIndex;
  const isApplicantPassed = formData.status === "passed" && isNotLastStage

  const moveToNextStage = () => {
    let applicant: ApplicantType
    const removedApplicant = state.map((stage: StageType) => {
      if (stage.id === actionState.stageId) {
        applicant = stage.applicants.find(applicant => applicant.id === actionState.applicantId)!
        const newApplicants = stage.applicants.filter(applicant => applicant.id !== actionState.applicantId)
        return {...stage, applicants: newApplicants}
      } else {
        return stage
      }
    })
    
    const addedApplicant = removedApplicant.map((stage: StageType, index: number) => {
      const isTheNextStage = index === stageIndex + 1
      if (isTheNextStage) {
        
        // Preserve all applicant data including dates, reset status and update checklists
        const updatedApplicant = {
          ...applicant,
          checklists: formData.checklists,
          status: null,
          // Preserve created_at and updated_at
          created_at: applicant.created_at,
          updated_at: applicant.updated_at,
        }
        return {...stage, applicants: [...stage.applicants, updatedApplicant]}
      } else {
        return stage
      }
    })
    
    return addedApplicant
  }

  const updateApplicant = () => {
    const newState = state.map((stage: StageType) => {
      if (stage.id === actionState.stageId) {
        const newApplicants = stage.applicants.map(applicant => {
          const {checklists, status} = formData
          if (applicant.id === actionState.applicantId) {
            return {...applicant, checklists, status }
          } else {
            return applicant
          }
        })
        return {...stage, applicants: newApplicants}
      } else {
        return stage
      }
    })
    
    return newState;
  }

  if (isApplicantPassed) {
    return moveToNextStage()
  } else {
    return updateApplicant()
  }
}
