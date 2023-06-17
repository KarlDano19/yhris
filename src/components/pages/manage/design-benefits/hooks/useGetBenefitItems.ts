import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getBenefitItems() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.API_URL}/api/benefits/`,
        config
      );
      if (res.ok) {
        return res.json();
      }
      throw res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetBenefitItems() {
  const query = useQuery(['benefitsItemCache'], () => getBenefitItems(), {
    keepPreviousData: true,
  });

  return query;
}

export default useGetBenefitItems;
