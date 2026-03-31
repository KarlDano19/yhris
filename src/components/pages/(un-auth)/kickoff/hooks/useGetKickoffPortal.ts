import { useQuery } from '@tanstack/react-query';

import { T_KickoffPortalData } from '@/types/kickoff';

async function getKickoffPortal(token: string): Promise<T_KickoffPortalData> {
  try {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kickoff/${token}/`,
      config
    );

    if (!res.ok) {
      throw res.json();
    }

    const data = await res.json();
    return data.data || data;
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetKickoffPortal(token: string) {
  const query = useQuery(
    ['kickoffPortal', token],
    () => getKickoffPortal(token),
    {
      refetchOnWindowFocus: false,
      enabled: !!token,
    }
  );
  return query;
}

export default useGetKickoffPortal;
