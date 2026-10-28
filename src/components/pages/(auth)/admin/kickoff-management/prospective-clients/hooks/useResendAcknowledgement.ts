import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resendAcknowledgement(id: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/${id}/resend-acknowledgement/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to resend acknowledgement email.');
  }
  return res.json();
}

function useResendAcknowledgement() {
  return useMutation((id: number) => resendAcknowledgement(id));
}

export default useResendAcknowledgement;
