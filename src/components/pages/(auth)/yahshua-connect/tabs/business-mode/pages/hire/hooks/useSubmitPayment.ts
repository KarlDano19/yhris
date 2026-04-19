import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_SubmitPaymentData, T_BusinessJobApplication } from '@/types/business-mode';

async function submitPayment(data: T_SubmitPaymentData): Promise<T_BusinessJobApplication> {
  const token = getCookie('token');

  const formData = new FormData();
  if (data.payment_amount !== undefined) {
    formData.append('payment_amount', data.payment_amount.toString());
  }
  if (data.payment_proof) {
    formData.append('payment_proof', data.payment_proof);
  }

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/payment/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit payment.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation<T_BusinessJobApplication, Error, T_SubmitPaymentData>(
    (data: T_SubmitPaymentData) => submitPayment(data),
    {
      onSuccess: () => {
        // Invalidate all related queries
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['myHiresCache']);
      },
    }
  );
}

