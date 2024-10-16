import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEmployeeCompensationLogbook(employee_compensation_logbook_id: string, data: any) {
  try {
    const token = getCookie('token');
    data.date_of_entry = data.date_of_entry.toLocaleDateString('en-CA');
    data.date_of_notification = data.date_of_notification.toLocaleDateString('en-CA');
    data.date_of_contingency = data.date_of_contingency.toLocaleDateString('en-CA');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employee-compensation-logbooks/${employee_compensation_logbook_id}/`,
      config
    );
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

function useUpdateEmployeeCompensationLogbook() {
  const query = useMutation((props: any) =>
    updateEmployeeCompensationLogbook(props.employee_compensation_logbook_id, props.data)
  );
  return query;
}

export default useUpdateEmployeeCompensationLogbook;
