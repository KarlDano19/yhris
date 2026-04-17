import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_UpdateClientSource = {
  employer_id: number;
  client_source: string;
  partner: string;
};

async function updateClientSource(data: T_UpdateClientSource): Promise<void> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${data.employer_id}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        client_source: data.client_source,
        partner: data.partner,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update client source.');
  }
}

export function useUpdateClientSource() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, T_UpdateClientSource>(
    (data) => updateClientSource(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientItemsCache']);
      },
    }
  );
}
