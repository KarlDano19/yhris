import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_Separation } from '@/types/globals';

async function addSeparation(separation: T_Separation) {
  try {
    const token = getCookie('token');
    const data = {
      employee: separation.name,
      position: separation.position,
      department: separation.department,
      date_of_separation: separation.date,
      reason_of_leaving: separation.reason,
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separations/`, config);
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

function useAddSeparationItems() {
  const query = useMutation((separation: T_Separation) =>
    addSeparation(separation)
  );

  return query;
}

export default useAddSeparationItems;
