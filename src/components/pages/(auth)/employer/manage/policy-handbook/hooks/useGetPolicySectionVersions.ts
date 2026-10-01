import { useQuery } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

async function getPolicySectionVersions(sectionId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/sections/${sectionId}/versions/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetPolicySectionVersions(sectionId: number | null) {
  const query = useQuery(
    ['policyHandbookSectionVersionsCache', sectionId],
    () => getPolicySectionVersions(sectionId as number),
    {
      enabled: sectionId !== null,
      refetchOnWindowFocus: false,
    }
  );
  return query;
}

export default useGetPolicySectionVersions;
