import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type ContactInfoPayload = {
  appliedJobId: number;
  email?: string;
  mobile?: string;
  address?: string;
};

async function updateApplicantContactInfo(data: ContactInfoPayload) {
  const { appliedJobId, ...fields } = data;
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/profile/${appliedJobId}/contact-info/`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update contact info.');
  }

  return res.json();
}

function useUpdateApplicantContactInfo() {
  const queryClient = useQueryClient();

  return useMutation((data: ContactInfoPayload) => updateApplicantContactInfo(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['applicantDetailsCache']);
    },
  });
}

export default useUpdateApplicantContactInfo;
