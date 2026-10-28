import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resendBenefitEmail(benefitId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/benefits/${benefitId}/resend/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useResendBenefitEmail() {
  const query = useMutation((benefitId: number) =>
    resendBenefitEmail(benefitId)
  );

  return query;
}

export default useResendBenefitEmail;
