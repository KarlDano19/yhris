import { initialActionState } from '../../lib/initialActionState';

export default function scheduleInterview(state: any, action: any) {
  const { actionState, setActionState, formData } = action.payload
  // schedule interview logic here...
  // Toast notification is now handled in Content.tsx onSuccess callback
  setActionState(initialActionState);
  return state
}
