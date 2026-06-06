import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateSeparationFields(id: string, fields: { effective_date?: string | null }) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separation/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ type_of_action: 'update_fields', ...fields }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update separation.');
  }
  return res.json();
}

function useUpdateSeparationFields(id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (fields: { effective_date?: string | null }) => updateSeparationFields(id, fields),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['separationCaseCache', id]);
      },
    }
  );
}

export default useUpdateSeparationFields;
