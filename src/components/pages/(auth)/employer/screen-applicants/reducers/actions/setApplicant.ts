export default function setApplicant(state: any, action: any) {
  const { applicant } = action.payload;
  const targetIndex = state.findIndex((item: any) => item.id === applicant.stagePosition);
  if (targetIndex !== -1) {
    const filteredItem = state[targetIndex].applicants.filter((item: any) => item.id === applicant.id);
    if (filteredItem.length === 0) {
      state[targetIndex].applicants.push(applicant);
    }
  }
  return state;
}
