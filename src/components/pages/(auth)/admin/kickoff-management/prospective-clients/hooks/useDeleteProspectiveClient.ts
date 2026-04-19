import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteProspectiveClient(id: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/${id}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete prospective client.');
  }
  return res.json();
}

function useDeleteProspectiveClient() {
  return useMutation((id: number) => deleteProspectiveClient(id));
}

export default useDeleteProspectiveClient;
