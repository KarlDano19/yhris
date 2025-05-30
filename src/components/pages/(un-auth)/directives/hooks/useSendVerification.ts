import { useMutation, UseMutationResult } from '@tanstack/react-query'; 

import { SendVerificationRequest, SendVerificationError, SendVerificationResponse } from '@/types/directives';
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/send-verification/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Failed to send verification code',
          status: response.status,
        };
      }

      return data;
    },
  });
};

export type { SendVerificationRequest, SendVerificationResponse, SendVerificationError };
export default useSendVerification; 