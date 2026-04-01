import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resendKickoff(id: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/${id}/resend-kickoff/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to resend kickoff invitation.');
  }
  return res.json();
}

function useResendKickoff() {
  return useMutation((id: number) => resendKickoff(id));
}

export default useResendKickoff;
