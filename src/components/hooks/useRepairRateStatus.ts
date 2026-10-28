import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function repairRateStatus() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/repair-rate-status/`, config);
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

function useRepairRateStatus() {
  const query = useMutation(() => repairRateStatus());

  return query;
}

export default useRepairRateStatus;
