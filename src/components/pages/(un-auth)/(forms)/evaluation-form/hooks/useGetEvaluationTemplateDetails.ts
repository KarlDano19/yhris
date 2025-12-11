import { useQuery } from '@tanstack/react-query';

async function getEvaluationTemplateDetails(evaluation_template_id: string | null) {
  try {
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/evaluation-templates/${evaluation_template_id}/`,
      config
    );
    if (!res.ok) {
      const errorData = await res.json();
      // Extract error message from backend response
      const errorMessage = errorData.message || errorData.description || errorData.errors || 'Unable to locate the Evaluation Template!';
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
    throw new Error(errStringify.message || 'Unable to locate the Evaluation Template!');
  }
}

function useGetEvaluationTemplateDetails(evaluation_template_id: string | null) {
  const query = useQuery(
    ['evaluationTemplateDetailsPublicCache'],
    () => getEvaluationTemplateDetails(evaluation_template_id),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: false, // Don't retry failed requests
      retryOnMount: false, // Don't retry on mount if query failed
    }
  );

  return query;
}

export default useGetEvaluationTemplateDetails;
