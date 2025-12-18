// D:\YAHSHUA\HRIS\yahshua-hris-fe\src\components\pages\(auth)\employer\settings\general-settings\employees\hooks\employee-id-settings\useGenerateEmployeeId.ts

import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function generateEmployeeId(data: any) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/employee-id/generate/`, config);
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

function useGenerateEmployeeId() {
  const query = useMutation({
    mutationFn: (data: any) => generateEmployeeId(data)
  });

  return query;
}

export default useGenerateEmployeeId;