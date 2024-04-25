import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

const contacts={
  id:1,
  userId:93,
  email:"juan.delacruz@gmail.com",
  mobileNo:"09092558726",
  landLineNo:"557-228",
  contactPerson:"Jully Dela Cruz",
  address:"Paete, Laguna",
  age:52,
  conteactPersonContactNumber: "09098874563",
  relationship:"Mother"
}

async function getContact(userId: any) {
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
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/contacts/?${userIdParam}`, // edit uri base from backend
    //     config
    //   );
    //   if (!res.ok) {
    //     throw res.json();
    //   }
    //   return res.json();
    // }
    return contacts;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetContact(userId: any) {
  const query = useQuery(
    ['edit-profile', userId],
    () => getContact(userId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetContact;
