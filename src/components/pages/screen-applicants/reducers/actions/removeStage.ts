import { initialActionState } from "../../lib/initialActionState"
import { StageType } from "../../types"

export default function removeStage(state: any, action: any) {
  const { stageId, setActionState } = action.payload
  const newState = state.filter((item: StageType) => item.id !== stageId)
  setActionState(initialActionState)
  return newState
}
