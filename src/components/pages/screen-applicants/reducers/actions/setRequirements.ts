import { StageType } from "../../types"

export default function setRequirements(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
    const newState = state.map((item: StageType) => {
      if (item.id === actionState.stageId) {
        return { ...item, requirements: formData }
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
