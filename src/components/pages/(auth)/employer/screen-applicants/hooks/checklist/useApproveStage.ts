import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ApproveStagePayload } from '../types';

async function approveStage(appliedJobId: number, data: T_ApproveStagePayload) {
  const token = getCookie('token');

  const formData = new FormData();
  formData.append('stage_id', String(data.stage_id));
  formData.append('is_skipped', String(data.is_skipped));
  if (data.signature) {
    if (data.signature.startsWith('data:')) {
      const base64 = data.signature.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/png' });
      formData.append('signature', blob, 'signature.png');
    } else {
      formData.append('signature', data.signature);
    }
  }
  if (data.approval_remarks) {
    formData.append('approval_remarks', data.approval_remarks);
  }
  if (data.approval_date) {
    formData.append('approval_date', data.approval_date);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-approve/${appliedJobId}/`,
    {
      method: 'PATCH',
      headers: {
        // NOTE: Do NOT set Content-Type for multipart/form-data — browser sets it with boundary
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to approve stage.');
  }
  return res.json();
}

function useApproveStage(appliedJobId: number) {
  const queryClient = useQueryClient();
  return useMutation(
    (data: T_ApproveStagePayload) => approveStage(appliedJobId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stage-notes', appliedJobId]);
        queryClient.invalidateQueries(['eaf', appliedJobId]);
        queryClient.invalidateQueries(['appliedApplicantsCache']);
      },
    }
  );
}

export default useApproveStage;
