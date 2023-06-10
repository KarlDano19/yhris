export default function dragBlock(state: any, action: any) {
  const { source, destination } = action.payload
  if (!destination) {
    return state
  }

  // swapping blocks from source to destination
  const result = Array.from(state)
  const [removed] = result.splice(source.index, 1)
  result.splice(destination.index, 0, removed)
  return result
}
