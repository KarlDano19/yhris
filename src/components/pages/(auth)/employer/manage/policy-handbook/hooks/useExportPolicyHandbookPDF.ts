import { useMutation } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

async function getPolicyHandbookPDF(): Promise<Blob> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/export-pdf/`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to export the policy handbook as PDF.');
  }

  return res.blob();
}

export function useExportPolicyHandbookPDF() {
  return useMutation<Blob, Error, void>(() => getPolicyHandbookPDF());
}
