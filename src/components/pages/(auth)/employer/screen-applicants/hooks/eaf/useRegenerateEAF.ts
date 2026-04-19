import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function regenerateEAF(appliedJobId: number): Promise<any> {
  const token = getCookie('token');
  let newFilters = { view_type: 'regenerate' };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/eaf/${appliedJobId}/`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newFilters),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to regenerate EAF.');
  }
  const json = await res.json();
  return json.data || json;
}

function useRegenerateEAF(appliedJobId: number) {
  const queryClient = useQueryClient();

  return useMutation(() => regenerateEAF(appliedJobId), {
    onSuccess: (data) => {
      queryClient.setQueryData(['eaf', appliedJobId], data);
    },
  });
}

export default useRegenerateEAF;
