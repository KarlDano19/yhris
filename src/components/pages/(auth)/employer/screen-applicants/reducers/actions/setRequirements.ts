import { StageType } from "../../types"
import toast from 'react-hot-toast'
import CustomToast from "@/components/CustomToast"
export default function setRequirements(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
    const newState = state.map((item: StageType) => {
      if (item.id === actionState.stageId) {
        return { ...item, requirements: formData }
      } else return item
    })
    
    // Show toast notification instead of modal
    toast.success("You have successfully set-up your stage requirements.", {
      duration: 7000,
    });
    
    // Close the current modal
    setActionState({
      ...actionState,
      modal: {
        whichModal: "",
        isOpen: false,
        title: "",
      },
    })
  return newState
}
