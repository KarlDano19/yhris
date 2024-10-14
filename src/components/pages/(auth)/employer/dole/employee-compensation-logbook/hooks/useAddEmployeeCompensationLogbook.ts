import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEmployeeCompensationLogbook(data: any) {
  try {
    const token = getCookie('token');
    data.date_of_entry = data.date_of_entry.toLocaleDateString('en-CA');
    data.date_of_notification = data.date_of_notification.toLocaleDateString('en-CA');
    data.date_of_contingency = data.date_of_contingency.toLocaleDateString('en-CA');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-compensation-logbooks/`, config);
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

function useAddEmployeeCompensationLogbook() {
  const query = useMutation((data: any) => addEmployeeCompensationLogbook(data));
  return query;
}

export default useAddEmployeeCompensationLogbook;
