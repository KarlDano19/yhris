import { useMutation } from '@tanstack/react-query';

import { VerifyDirectiveParams } from '@/types/directives';

async function verifyDirectiveCode({ directiveId, emailIndex, code }: VerifyDirectiveParams) {
  try {
    // Use Next.js API route — real email is resolved server-side only
    const apiUrl = `/api/directives/${directiveId}/verify-code`;

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailIndex, code }),
    };

    const res = await fetch(apiUrl, config);

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

/**
 * Hook for verifying verification code for directive.
 * Sends emailIndex to Next.js API route — real email is resolved server-side only.
 */
const useVerifyDirective = () => {
  return useMutation({
    mutationFn: (params: VerifyDirectiveParams) => verifyDirectiveCode(params),
  });
};

export default useVerifyDirective;
