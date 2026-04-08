import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_RecordPaymentData = {
  employer_id: number;
  plan_id: number;
  periodicity: 'monthly' | 'yearly';
  periodicity_duration?: number | null;
  amount: number;
  payment_method: 'Bank Transfer' | 'Cheque' | 'Cash';
  payor: string;
  reference_number: string;
  notes?: string;
};

async function recordPayment(data: T_RecordPaymentData): Promise<void> {
  const token = getCookie('token');
  const { employer_id, ...body } = data;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${employer_id}/transactions/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to record payment.');
  }
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, T_RecordPaymentData>(
    (data) => recordPayment(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientItemsCache']);
      },
    }
  );
}
