import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addLocationToYP(locationData: { id: string; data: any }) {
  const token = getCookie('token');
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(locationData.data),
  };
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/sync-create/`, config);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add location to YP');
  }
  
  return res.json();
}

function useAddLocationToYP() {
  const query = useMutation({
    mutationFn: (locationData: { id: string; data: any }) => addLocationToYP(locationData)
  });

  return query;
}

export default useAddLocationToYP;
