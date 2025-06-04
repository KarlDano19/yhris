import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addPersonnelMovement(data: any) {
  try {
    const token = getCookie('token');
    if (data.start_date) {
      const startDate = new Date(data.start_date);
      if (!isNaN(startDate.getTime())) {
        // Adjust for timezone offset to preserve local date
        const offset = startDate.getTimezoneOffset();
        const adjustedDate = new Date(startDate.getTime() - offset * 60000);
        data.start_date = adjustedDate.toISOString().split("T")[0];
      }
    }
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddPersonnelMovement() {
  const queryClient = useQueryClient();
  const mutation = useMutation(addPersonnelMovement, {
    onSuccess: () => {
      queryClient.invalidateQueries(['personnelMovementsCache']);
    },
  });

  return mutation;
}

export default useAddPersonnelMovement;