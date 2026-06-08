import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function toggleApplicantStatus({ id, is_active }: { id: number; is_active: boolean }) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ is_active }),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/applicants/${id}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update applicant status.');
  }
  return res.json();
}

function useToggleApplicantStatus() {
  return useMutation(({ id, is_active }: { id: number; is_active: boolean }) =>
    toggleApplicantStatus({ id, is_active })
  );
}

export default useToggleApplicantStatus;
