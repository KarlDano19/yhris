import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_MoveApplicantData = {
  job_posting_id: number;
  job_stage_id: number;
};

async function moveApplicantToJob(appliedJobId: number, data: T_MoveApplicantData) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/move-to-job/${appliedJobId}/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to transfer applicant.');
  }

  return await res.json();
}

function useMoveApplicantToJob(appliedJobId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: T_MoveApplicantData) => moveApplicantToJob(appliedJobId, data),
    onSuccess: () => {
      // The applicant now belongs to a new posting — refresh every view that is
      // scoped to the old posting/stages so the UI reflects the destination folder.
      queryClient.invalidateQueries(['appliedApplicantsCache']);
      queryClient.invalidateQueries(['applicantDetailsCache']);
      queryClient.invalidateQueries(['jobPostDetailsCache']);
      queryClient.invalidateQueries(['stageAssignmentsCache']);
      queryClient.invalidateQueries(['eaf']);
      queryClient.invalidateQueries(['transferHistoryCache']);
    },
  });
}

export default useMoveApplicantToJob;
