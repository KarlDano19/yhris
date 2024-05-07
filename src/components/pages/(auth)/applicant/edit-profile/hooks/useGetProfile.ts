import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

const data =
  {
    id:25,
    userId:93,
    name:"Juan Dela Cruz",
    about:"Good employee",
    profilePicture:"profile picture",
    birthDay:"1993-10-30",
    age:30,
    gender:"Male",
    religion:"Roman Catholic",
    nationality:"Filipino",
    civilStatus:"Married",
    houseNo:"111",
    street:"Looban",
    townBrgy:"Uno",
    city:"Paete Laguna",
    zipCode:"4016",
    country:"Philippines"
  }

async function getProfile(userId: any) {
  try {
    // const userIdParam = new URLSearchParams(userId);
    // const token = getCookie('token');
    // const config = {
    //   method: 'GET',
    //   headers: {
    //     'content-type': 'application/json',
    //     Authorization: `Token ${token}`,
    //   },
    // };
    // if (token) {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userIdParam}`, // edit uri base from backend
    //     config
    //   );
    //   if (!res.ok) {
    //     throw res.json();
    //   }
    //   return res.json();
    // }
    return data;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetProfile(userId: any) {
  const query = useQuery(
    ['profile', userId],
    () => getProfile(userId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetProfile;
