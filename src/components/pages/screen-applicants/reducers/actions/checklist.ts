import { ApplicantType, StageType } from "../../types";

export default function checklist(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload;
  const stageIndex = state.findIndex((stage: StageType) => stage.id === actionState.stageId);
  const isNotLastStage = state.length - 1 !== stageIndex;
  const isApplicantPassed = formData.status === "passed" && isNotLastStage

  const successModal = {
  ...actionState,
  modal: {
    whichModal: "SUCCESS",
    isOpen: true,
    title: "You have successfully updated the checklist.",
  },
  };

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
        
        // reset applicant's status first
        applicant.checklists = formData.checklists
        applicant.status = null
        return {...stage, applicants: [...stage.applicants, applicant]}
      } else {
        return stage
      }
    })
    
    setActionState(successModal);
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
    
    setActionState(successModal);
    return newState;
  }

  if (isApplicantPassed) {
    return moveToNextStage()
  } else {
    return updateApplicant()
  }
}
