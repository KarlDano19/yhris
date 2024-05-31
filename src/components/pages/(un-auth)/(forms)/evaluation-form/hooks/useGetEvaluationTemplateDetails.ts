import { useQuery } from '@tanstack/react-query';

async function getEvaluationTemplateDetails(evaluation_template_id: number | null) {
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

function useGetEvaluationTemplateDetails(evaluation_template_id: number | null) {
  const query = useQuery(
    ['evaluationTemplateDetailsPublicCache'],
    () => getEvaluationTemplateDetails(evaluation_template_id),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEvaluationTemplateDetails;
