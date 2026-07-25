import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resendBenefit(benefitId: number): Promise<any> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/benefits/${benefitId}/resend/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to resend benefit email.');
  }

  return res.json();
}

function useResendBenefit() {
  return useMutation((benefitId: number) => resendBenefit(benefitId));
}

export default useResendBenefit;
