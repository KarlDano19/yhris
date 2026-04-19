import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markApplicantNotificationAsRead(notificationId: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/yahshua-connect/notifications/${notificationId}/`,
    config
  );

  if (!res.ok) {
    throw new Error('Failed to mark applicant notification as read');
  }

  return res.json();
}

function useMarkApplicantNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation(
    (notificationId: number) => markApplicantNotificationAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['applicantNotifications']);
      },
    }
  );
}

export default useMarkApplicantNotificationRead;


