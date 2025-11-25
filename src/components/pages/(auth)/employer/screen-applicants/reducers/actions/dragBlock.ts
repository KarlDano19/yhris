export default function dragBlock(state: any, action: any) {
  const { source, destination } = action.payload
  if (!destination || source.index === destination.index) {
    return state // No change needed
  }

  // swapping blocks from source to destination
  const result = Array.from(state)
  const [removed] = result.splice(source.index, 1)
  result.splice(destination.index, 0, removed)
  
  // Update orderBy values
  return result.map((item: any, index: any) => ({
    ...item,
    orderBy: index
  }))
}