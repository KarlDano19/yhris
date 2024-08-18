import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEvaluationScheduler(data: any) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('employees', JSON.stringify(data.employees));
    formData.append('evaluation_template', data.evaluation_template);
    formData.append('frequency_unit', data.frequency_unit);
    formData.append('frequency_value', data.frequency_value);
    formData.append('message', data.message);
    formData.append('name', data.name);
    formData.append('reminder_schedule', data.reminder_schedule);
    if (data.attachment && data.attachment.length) {
      formData.append('attachment', data.attachment[0]);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/`, config);
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

function useAddEvaluationScheduler() {
  const query = useMutation((data: any) => addEvaluationScheduler(data));
  return query;
}

export default useAddEvaluationScheduler;
