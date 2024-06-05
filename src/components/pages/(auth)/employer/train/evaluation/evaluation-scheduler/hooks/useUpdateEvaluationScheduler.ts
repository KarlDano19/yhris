import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEvaluationScheduler(evaluation_scheduler_id: string, data: any) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('employee', JSON.stringify(data.employee));
    formData.append('evaluation_template', data.evaluation_template);
    formData.append('frequency_unit', data.frequency_unit);
    formData.append('frequency_value', data.frequency_value);
    formData.append('message', data.message);
    formData.append('name', data.name);
    formData.append('reminder_schedule', data.reminder_schedule);
    if (data.attachments && data.attachments.length) {
      formData.append('attachment', data.attachments[0]);
    }
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/${evaluation_scheduler_id}/`, config);
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

function useUpdateEvaluationScheduler() {
  const query = useMutation((props: any) => updateEvaluationScheduler(props.evaluationSchedulerId, props.data));
  return query;
}

export default useUpdateEvaluationScheduler;
