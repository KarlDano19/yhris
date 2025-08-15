import { useMutation } from '@tanstack/react-query';

interface OTPVerificationPayload {
  session_id: string;
  code: string;
  email: string;
}

async function verifyOTP(payload: OTPVerificationPayload) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(`/api/login/otp/verify/`, config);
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

function useOTPVerification() {
  const query = useMutation((payload: OTPVerificationPayload) => verifyOTP(payload));
  return query;
}

export default useOTPVerification; 