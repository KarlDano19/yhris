import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteClient(employerId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${employerId}/`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete client.');
  }
  return res.json();
}

function useDeleteClient() {
  return useMutation((employerId: number) => deleteClient(employerId));
}

export default useDeleteClient;
