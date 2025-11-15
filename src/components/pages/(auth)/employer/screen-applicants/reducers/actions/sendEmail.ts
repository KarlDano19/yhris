import { initialActionState } from '../../lib/initialActionState';

export default function sendEmail(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
  // send email logic here...
  // Toast notification is now handled in Content.tsx onSuccess callback
  setActionState(initialActionState);
  return state
}