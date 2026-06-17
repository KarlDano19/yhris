import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function toggleEmployerOTP(payload: { employerId: number | string; is_enabled: boolean }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${payload.employerId}/otp/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ is_enabled: payload.is_enabled }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update OTP settings.');
  }
  return res.json();
}

function useToggleEmployerOTP() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: { employerId: number | string; is_enabled: boolean }) =>
      toggleEmployerOTP(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientItemsCache']);
      },
    }
  );
}

export default useToggleEmployerOTP;
