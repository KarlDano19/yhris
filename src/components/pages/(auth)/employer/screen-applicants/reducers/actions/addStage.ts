import { StageType } from "../../types"

export default function addStage(state: any, action: any) {
  const { id, addType } = action.payload

  let newState
  const newStage = {
    id: id,
    title: "Untitled",
    isNewStage: true,
    requirements: [],
    applicants: [],
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
