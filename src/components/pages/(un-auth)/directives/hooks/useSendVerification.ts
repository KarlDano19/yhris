import { useMutation, UseMutationResult } from '@tanstack/react-query'; 

import { SendVerificationRequest, SendVerificationError, SendVerificationResponse } from '@/types/directives';

async function sendVerificationCode(directiveId: string | number, email: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/send-verification/`;
    
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };
    
    const res = await fetch(apiUrl, config);
    
    if (!res.ok) {
      throw res.json();
    }
    
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    
    // Check if this is a rate limit error with cooldown information
    if (errStringify.status === 429 && errStringify.cooldown_remaining) {
      throw {
        message: errStringify.message || 'Please wait before requesting another code',
        status: errStringify.status,
        cooldown_remaining: errStringify.cooldown_remaining
      };
    }
    
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

/**
 * Hook for sending verification codes to directive recipients
 */
export const useSendVerification = (directiveId: string | number): UseMutationResult<
  SendVerificationResponse,
  SendVerificationError,
  SendVerificationRequest,
  unknown
> => {
  return useMutation<SendVerificationResponse, SendVerificationError, SendVerificationRequest>({
    mutationFn: async ({ email }: SendVerificationRequest) => {
      return sendVerificationCode(directiveId, email);
    },
  });
};

export type { SendVerificationRequest, SendVerificationResponse, SendVerificationError };
export default useSendVerification; 