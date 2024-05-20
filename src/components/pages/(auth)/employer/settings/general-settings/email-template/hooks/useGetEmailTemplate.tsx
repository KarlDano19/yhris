import { useQuery } from '@tanstack/react-query';

async function getEmailTemplate() {
  try {
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-template/`, config);
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

function useGetEmailTemplate() {
  const query = useQuery(['payments', {}], () => getEmailTemplate(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetEmailTemplate;
