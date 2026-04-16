import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_UpdateEAFData = {
  appliedJobId: number;
  recruitment_notes?: string;
};

async function updateEAF({ appliedJobId, ...data }: T_UpdateEAFData): Promise<any> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/eaf/${appliedJobId}/`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update EAF.');
  }
  const json = await res.json();
  return json.data || json;
}

function useUpdateEAF() {
  const queryClient = useQueryClient();

  return useMutation(updateEAF, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['eaf', variables.appliedJobId], data);
    },
  });
}

export default useUpdateEAF;
