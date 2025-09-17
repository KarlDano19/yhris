import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEmployeeStatus(employeeStatus: any) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(employeeStatus),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-status/`, config);
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

function useAddEmployeeStatus() {
  const query = useMutation((employeeStatus: any) => addEmployeeStatus(employeeStatus));

  return query;
}

export default useAddEmployeeStatus;
