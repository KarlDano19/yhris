import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEvaluationScheduler(evaluation_scheduler_id: string, data: any) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('employees', JSON.stringify(data.employees));
    formData.append('recipient', JSON.stringify(data.recipient));
    formData.append('evaluation_template', data.evaluation_template);
    formData.append('frequency_unit', data.frequency_unit);
    formData.append('frequency_value', data.frequency_value);
    formData.append('message', data.message);
    formData.append('name', data.name);
    formData.append('reminder_schedule', data.reminder_schedule);
    if (data.deadline) {
      formData.append('deadline', data.deadline);
    } else if (data.deadline === null || data.deadline === '') {
      formData.append('deadline', '');
    }
    if (data.close_after_deadline !== undefined) {
      formData.append('close_after_deadline', data.close_after_deadline ? 'true' : 'false');
    }
    if (data.attachment && typeof data.attachment === "object" && data.attachment.length) {
      formData.append('attachment', data.attachment[0]);
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
