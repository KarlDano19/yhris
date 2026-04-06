import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStageAssignments(data: {
  stageId: number;
  assigned_users: number[];
  can_view_applicants?: boolean;
  can_move_applicants?: boolean;
  can_update_status?: boolean;
}) {
  try {
    const { stageId, ...payload } = data;
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/screen-applicants/stages/${stageId}/assignments/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || 'Failed to update stage assignments';
  }
}

function useUpdateStageAssignments() {
  const query = useMutation((data: {
    stageId: number;
    assigned_users: number[];
    can_view_applicants?: boolean;
    can_move_applicants?: boolean;
    can_update_status?: boolean;
  }) => updateStageAssignments(data));

  return query;
}

export default useUpdateStageAssignments;

