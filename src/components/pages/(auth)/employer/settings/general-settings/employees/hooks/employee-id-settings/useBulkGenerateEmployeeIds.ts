// D:\YAHSHUA\HRIS\yahshua-hris-fe\src\components\pages\(auth)\employer\settings\general-settings\employees\hooks\employee-id-settings\useBulkGenerateEmployeeIds.ts

import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function bulkGenerateEmployeeIds() {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/employee-id/bulk-generate/`, config);
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

function useBulkGenerateEmployeeIds() {
  const query = useMutation({
    mutationFn: () => bulkGenerateEmployeeIds()
  });

  return query;
}

export default useBulkGenerateEmployeeIds;