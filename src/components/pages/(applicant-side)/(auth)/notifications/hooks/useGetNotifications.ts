import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
const data =[{
  id:1,
  userId:93,
  message:"The ABBA Initiative has reviewed your application. You have passed the screening. You are scheduled for an Initial Interview on April 8, 2023. Please check your email for further details. Thank you and GOD bless!"
},
{
  id:2,
  userId:93,
  message:"The ABBA Initiative has reviewed your application. You have passed the screening. You are scheduled for an Initial Interview on April 8, 2023. Please check your email for further details. Thank you and GOD bless!"
},
]

async function getNotifications(userId: any) {
  // try {
  //   const userIdParam = new URLSearchParams(userId);
  //   const token = getCookie('token');
  //   const config = {
  //     method: 'GET',
  //     headers: {
  //       'content-type': 'application/json',
  //       Authorization: `Token ${token}`,
  //     },
  //   };
  //   if (token) {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/notification/?${userIdParam}`,
  //       config
  //     );
  //     if (!res.ok) {
  //       throw res.json();
  //     }
  //     return res.json();
  //   }
  //   return notification;
  // } catch (err: any) {
  //   let errStringify = await err;
  //   if (Object.hasOwn(errStringify, 'response')) {
  //     throw errStringify.response.data.message;
  //   }
  //   throw errStringify.message;
  // }
  return data;
}

function useGetNotifications(userId: any) {
  const query = useQuery(
    ['notificationsItemCache', userId],
    () => getNotifications(userId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetNotifications;
