import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function generateApplicantSummary(applicantId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({}), // Empty body since applicantId comes from URL
    };
    
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${applicantId}/generate-summary/`, 
        config
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate summary');
      }
      
      return res.json();
    }
    
    throw new Error('No authentication token found');
  } catch (err: any) {
    if (err instanceof Error) {
      throw err;
    }
    
    // Handle other error formats
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw new Error(errStringify.response.data.message);
    }
    throw new Error(errStringify.message || 'An unexpected error occurred');
  }
}

export default function useGenerateApplicantSummary() {
  return useMutation({
    mutationFn: generateApplicantSummary,
    onError: (error) => {
      console.error('Summary generation failed:', error);
    },
  });
}
