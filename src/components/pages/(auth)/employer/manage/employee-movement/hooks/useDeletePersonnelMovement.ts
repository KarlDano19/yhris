import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deletePersonnelMovement(id: number) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/${id}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete.');
  }
  return res.status === 204 ? { message: 'Personnel movement deleted successfully.' } : res.json();
}

function useDeletePersonnelMovement() {
  return useMutation((id: number) => deletePersonnelMovement(id));
}

export default useDeletePersonnelMovement;
