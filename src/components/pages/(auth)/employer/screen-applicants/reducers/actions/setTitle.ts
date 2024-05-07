import { StageType } from "../../types"

export default function setTitle(state: any, action: any) {
  const { title, stageId } = action.payload
  const newState = state.map((item: StageType) => {
    if (item.id === stageId) {
      return { ...item, title }
    } else return item
  })
  return newState
}
