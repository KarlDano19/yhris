import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { TourProgressData } from './useGetTourProgress';

type TourProgressPatch = Partial<TourProgressData>;

async function updateTourProgress(data: TourProgressPatch): Promise<TourProgressData> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-progress/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update tour progress.');
  }
  return res.json();
}

function useUpdateTourProgress() {
  const queryClient = useQueryClient();
  return useMutation((data: TourProgressPatch) => updateTourProgress(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tourProgressCache']);
    },
  });
}

export default useUpdateTourProgress;
