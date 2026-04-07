import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_CreateClientData = {
  company_name: string;
  email: string;
  mobile_number?: string;
  client_source: string;
  partner?: string;
  plan_id: number;
  is_trial: boolean;
};

async function createClient(data: T_CreateClientData): Promise<void> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/create/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create client.');
  }
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, T_CreateClientData>(
    (data) => createClient(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientItemsCache']);
      },
    }
  );
}
