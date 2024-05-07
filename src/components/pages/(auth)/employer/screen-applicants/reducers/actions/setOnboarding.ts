export default function setOnboarding(action: any) {
  const { jobStages } = action.payload;
  return jobStages;
}
