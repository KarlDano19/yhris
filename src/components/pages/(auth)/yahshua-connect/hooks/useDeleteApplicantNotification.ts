import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteApplicantNotification(notificationId: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/yahshua-connect/notifications/${notificationId}/`,
    config
  );

  if (!res.ok) {
    throw new Error('Failed to delete applicant notification');
  }

  return res.json();
}

function useDeleteApplicantNotification() {
  const queryClient = useQueryClient();

  return useMutation(
    (notificationId: number) => deleteApplicantNotification(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['applicantNotifications']);
      },
    }
  );
}

export default useDeleteApplicantNotification;


