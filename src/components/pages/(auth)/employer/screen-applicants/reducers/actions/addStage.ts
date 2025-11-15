import { StageType } from "../../types"

export default function addStage(state: any, action: any) {
  const { id, addType } = action.payload

  let newState
  const newStage = {
    id: id,
    title: "",
    isNewStage: true,
    requirements: [],
    applicants: [],
    addType: addType,
    is_final_stage: false, // New stages are never final stages
    // Add default permissions for new stages
    permissions: {
      can_view: true,
      can_move: true,
      can_update: true,
      is_visible: true
    }
  }

  if (addType === "adjacent") {
    const adjacentIndex = action.payload.index
    newState = [...state]
    newState.splice(adjacentIndex, 0, newStage)
  } else if (addType === "last") {
    newState = [...state]
    newState.push(newStage)
    return newState
  } else {
    newState = state
  }

  return newState
}
