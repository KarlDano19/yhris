import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SummaryResponse {
  message: string;
  summary: string;
  was_cached: boolean;
}

interface SummaryOptions {
  force_regenerate?: boolean;
}

async function generateApplicantSummary(applicantId: number, options: SummaryOptions = {}) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        force_regenerate: options.force_regenerate || true
      }),
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
      
      const result = await res.json();
      return result as SummaryResponse;
    }
    
    throw new Error('No authentication token found');
  } catch (err: any) {
    if (err instanceof Error) {
      throw err;
    }
    
    // Handle other error formats
    let errorMessage = 'Failed to generate summary';
    if (typeof err === 'object' && err !== null) {
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
    }
    
    throw new Error(errorMessage);
  }
}

export default function useGenerateApplicantSummary() {
  return useMutation({
    mutationFn: ({ applicantId, options }: { applicantId: number; options?: SummaryOptions }) => 
      generateApplicantSummary(applicantId, options),
    onError: (error) => {
      console.error('Summary generation failed:', error);
    },
  });
}
