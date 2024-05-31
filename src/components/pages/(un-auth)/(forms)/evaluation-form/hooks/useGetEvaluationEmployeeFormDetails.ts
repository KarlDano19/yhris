import { useQuery } from '@tanstack/react-query';

async function getEvaluationEmployeeFormDetails(form_uuid: string | null) {
  try {
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
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

function useGetEvaluationEmployeeFormDetails(form_uuid: string | null) {
  const query = useQuery(
    ['evaluationEmployeeFormDetailsPublicCache'],
    () => getEvaluationEmployeeFormDetails(form_uuid),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEvaluationEmployeeFormDetails;
