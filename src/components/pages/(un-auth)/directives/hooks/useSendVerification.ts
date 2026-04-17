import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { SendVerificationRequest, SendVerificationError, SendVerificationResponse } from '@/types/directives';

async function sendVerificationCode(directiveId: string | number, emailIndex: number) {
  try {
    // Use Next.js API route — real email never leaves the server
    const apiUrl = `/api/directives/${directiveId}/send-verification`;

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailIndex }),
    };

    const res = await fetch(apiUrl, config);

    if (!res.ok) {
      throw res.json();
    }

    return res.json();
  } catch (err: any) {
    let errStringify = await err;

    if (errStringify.status === 429 && errStringify.cooldown_remaining) {
      throw {
        message: errStringify.message || 'Please wait before requesting another code',
        status: errStringify.status,
        cooldown_remaining: errStringify.cooldown_remaining,
      };
    }

    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

/**
 * Hook for sending verification codes to directive recipients.
 * Sends emailIndex to Next.js API route — real email is resolved server-side only.
 */
export const useSendVerification = (directiveId: string | number): UseMutationResult<
  SendVerificationResponse,
  SendVerificationError,
  SendVerificationRequest,
  unknown
> => {
  return useMutation<SendVerificationResponse, SendVerificationError, SendVerificationRequest>({
    mutationFn: async ({ emailIndex }: SendVerificationRequest) => {
      return sendVerificationCode(directiveId, emailIndex);
    },
  });
};

export type { SendVerificationRequest, SendVerificationResponse, SendVerificationError };
export default useSendVerification;
