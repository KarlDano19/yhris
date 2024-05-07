export default function scheduleInterview(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
  // schedule interview logic here...
  setActionState({
    ...actionState,
    modal: {
      whichModal: "SUCCESS",
      isOpen: true,
      title: "You have successfully sent interview request.",
    },
  })
  return state
}
