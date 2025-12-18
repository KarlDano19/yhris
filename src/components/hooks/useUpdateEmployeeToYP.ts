import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEmployeeToYP(employeeData: { id: string; data: any }) {
  try {
    console.log("updateEmployeeToYP", employeeData);
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(employeeData.data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/sync-create/`, config);
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

function useUpdateEmployeeToYP() {
  const query = useMutation((employeeData: { id: string; data: any }) => updateEmployeeToYP(employeeData));

  return query;
}

export default useUpdateEmployeeToYP;
