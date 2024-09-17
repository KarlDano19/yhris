import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
const applications =[
  {
    id:1,
    userId:93,
    applicationDate:"2023-02-02",
    jobTitle:"Accounting Officer",
    company:"The ABBA Initiative",
    status:"For Review",
    statusUpdateDate:"2023-02-02"
  },
  {
    id:1,
    userId:93,
    applicationDate:"2023-04-02",
    jobTitle:"Web Developer",
    company:"The ABBA Initiative",
    status:"Hired",
    statusUpdateDate:"2023-05-02"
  }
]
async function getApplicationByUser(userId: any) {
  try {
    const userIdParam = new URLSearchParams(userId);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/applied-jobs/?${userIdParam}`, //change uri base from backend
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return applications;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetApplicationByUser(userId: any) {
  const query = useQuery(
    ['jobAppliedCache', userId],
    () => getApplicationByUser(userId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetApplicationByUser;
