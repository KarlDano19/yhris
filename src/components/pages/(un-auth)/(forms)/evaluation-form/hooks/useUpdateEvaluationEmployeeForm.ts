import { useMutation } from '@tanstack/react-query';

async function updateEvaluationForm(form_uuid: string, data: any) {
  try {
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/evaluation-employee-forms/${form_uuid}/`,
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

function useUpdateEvaluationForm() {
  const query = useMutation((props: any) => updateEvaluationForm(props.form_uuid, props.data));
  return query;
}

export default useUpdateEvaluationForm;
