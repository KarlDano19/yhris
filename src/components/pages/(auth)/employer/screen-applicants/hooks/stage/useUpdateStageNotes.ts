import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Create or update stage notes
async function updateStageNotes(appliedJobId: number, stageId: number, notes: string) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-notes/${appliedJobId}/`, {
    method: "POST",
    body: JSON.stringify({ 
      stage_id: stageId,
      notes: notes
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

function useUpdateStageNotes() {
  const mutation = useMutation({
    mutationFn: ({ 
      appliedJobId, 
      stageId, 
      notes
    }: { 
      appliedJobId: number; 
      stageId: number; 
      notes: string; 
    }) =>
      updateStageNotes(appliedJobId, stageId, notes),
  });

  return mutation;
}

export default useUpdateStageNotes;