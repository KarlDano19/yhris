import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function createPartner(data: any) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create partner.');
  }
  return res.json();
}

function useCreatePartner() {
  return useMutation((data: any) => createPartner(data));
}

export default useCreatePartner;
