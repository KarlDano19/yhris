import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function createProspectiveClient(data: any) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create prospective client.');
  }
  return res.json();
}

function useCreateProspectiveClient() {
  return useMutation((data: any) => createProspectiveClient(data));
}

export default useCreateProspectiveClient;
