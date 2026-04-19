import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updatePartner({ id, data }: { id: number; data: any }) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/${id}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update partner.');
  }
  return res.json();
}

function useUpdatePartner() {
  return useMutation(({ id, data }: { id: number; data: any }) => updatePartner({ id, data }));
}

export default useUpdatePartner;
