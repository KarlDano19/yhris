import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteEmployee(employee_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${employee_id}/`, config);
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

function useDeleteEmployee() {
  const query = useMutation((employee_id: number | null) => deleteEmployee(employee_id));
  return query;
}

export default useDeleteEmployee;
