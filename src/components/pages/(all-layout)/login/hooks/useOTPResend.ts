import { useMutation } from '@tanstack/react-query';

interface OTPResendPayload {
  session_id: string;
}

async function resendOTP(payload: OTPResendPayload) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(`/api/login/otp/resend/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify.detail;
    }
    throw errStringify.message;
  }
}

function useOTPResend() {
  const query = useMutation((payload: OTPResendPayload) => resendOTP(payload));
  return query;
}

export default useOTPResend; 