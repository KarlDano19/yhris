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
      const errorData = await res.json();
      // Extract error message from backend response
      const errorMessage = errorData.message || errorData.description || errorData.errors || 'Failed to update evaluation form';
      throw new Error(errorMessage);
    }
    return res.json();
  } catch (err: any) {
    // If it's already an Error object, re-throw it
    if (err instanceof Error) {
      throw err;
    }
    // Otherwise, try to extract message
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw new Error(errStringify.response.data.message);
    }
    throw new Error(errStringify.message || 'Failed to update evaluation form');
  }
}

function useUpdateEvaluationForm() {
  const query = useMutation((props: any) => updateEvaluationForm(props.form_uuid, props.data));
  return query;
}

export default useUpdateEvaluationForm;
