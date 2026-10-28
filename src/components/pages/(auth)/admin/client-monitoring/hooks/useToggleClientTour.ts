import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function toggleClientTour(payload: { employerId: number | string; enable_tour: boolean }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${payload.employerId}/tour-progress/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ enable_tour: payload.enable_tour }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update tour setting.');
  }
  return res.json();
}

function useToggleClientTour() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: { employerId: number | string; enable_tour: boolean }) =>
      toggleClientTour(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientItemsCache']);
      },
    }
  );
}

export default useToggleClientTour;
