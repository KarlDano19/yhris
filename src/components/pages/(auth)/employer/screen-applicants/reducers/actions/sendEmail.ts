export default function sendEmail(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
  // send email logic here...
  setActionState({
    ...actionState,
    modal: {
      whichModal: "SUCCESS",
      isOpen: true,
      title: "You have successfully sent an email.",
    },
  })
  return state
}