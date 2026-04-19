import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deletePartner(id: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/${id}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete partner.');
  }
  return res.json();
}

function useDeletePartner() {
  return useMutation((id: number) => deletePartner(id));
}

export default useDeletePartner;
