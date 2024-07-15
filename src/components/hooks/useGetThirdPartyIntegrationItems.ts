import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getThirdPartyIntegration() {
  try {
    let newFilters = { view_type: 'select' };
    const searchParams = new URLSearchParams(newFilters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/third-party-integrations/?${searchParams}`, config);
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

function useGetThirdPartyIntegrationItems() {
  const query = useQuery(['ThirdPartyIntegrationItemsCache'], () => getThirdPartyIntegration(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetThirdPartyIntegrationItems;
