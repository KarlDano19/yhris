import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addDepartment(department: any) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(department),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/`, config);
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

function useAddDepartment() {
  const query = useMutation((department: any) => addDepartment(department));

  return query;
}

export default useAddDepartment;
