import { useMutation } from '@tanstack/react-query';

import { VerifyDirectiveParams } from '@/types/directives';
/**
 * Hook for verifying verification code for directive
 */
const useVerifyDirective = () => {
  return useMutation({
    mutationFn: async ({ directiveId, email, code }: VerifyDirectiveParams) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/verify-code/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code }),
        }
      );

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      return response.json();
    }
  });
};

export default useVerifyDirective; 