import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addPositionToYP(positionData: { id: string; data: any }) {
  const token = getCookie('token');
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(positionData.data),
  };
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions/sync-create/`, config);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add position to YP');
  }
  
  return res.json();
}

function useAddPositionToYP() {
  const query = useMutation({
    mutationFn: (positionData: { id: string; data: any }) => addPositionToYP(positionData)
  });

  return query;
}

export default useAddPositionToYP;
