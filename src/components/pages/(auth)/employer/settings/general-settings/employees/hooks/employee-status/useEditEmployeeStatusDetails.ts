import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function editEmployeeStatusDetails(employee_status_id: number, data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-status/${employee_status_id}/`, config);
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

function useEditEmployeeStatusDetails() {
  const query = useMutation((props: any) => editEmployeeStatusDetails(props.employee_status_id, props.data));
  return query;
}

export default useEditEmployeeStatusDetails;
