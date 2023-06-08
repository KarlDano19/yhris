export default function addStage(state: any) {
  const newState = [...state]
  newState.push({
    id: Date.now(),
    title: "Untitled",
    isNewStage: true,
    requirements: [],
    applicants: [],
  })
  return newState
}
