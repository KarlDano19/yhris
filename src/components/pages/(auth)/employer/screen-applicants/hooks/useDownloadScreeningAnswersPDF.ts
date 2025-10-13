import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

export async function downloadScreeningAnswersPDF(
  appliedJobId: number, 
  jobTitle?: string, 
  applicantName?: string
) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/profile/${appliedJobId}/download-pdf/`,
        config
      );
      
      if (!res.ok) {
        throw res.json();
      }

      // Return blob, headers, and additional info for filename generation
      return {
        blob: await res.blob(),
        contentDisposition: res.headers.get('Content-Disposition'),
        jobTitle,
        applicantName
      };
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

interface DownloadParams {
  appliedJobId: number;
  jobTitle?: string;
  applicantName?: string;
}

function useDownloadScreeningAnswersPDF() {
  const query = useMutation({
    mutationFn: ({ appliedJobId, jobTitle, applicantName }: DownloadParams) => 
      downloadScreeningAnswersPDF(appliedJobId, jobTitle, applicantName),
    onSuccess: (response, { appliedJobId, jobTitle, applicantName }) => {
      if (response && response.blob) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(response.blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate custom filename with job title and applicant name
        let filename = `screening_answers_${appliedJobId}.pdf`; // fallback
        
        // Clean strings for filename (remove special characters)
        const cleanString = (str: string) => 
          str.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_').trim();
        
        if (jobTitle || applicantName) {
          const parts = [];
          if (jobTitle) parts.push(cleanString(jobTitle));
          if (applicantName) parts.push(cleanString(applicantName));
          filename = `${parts.join('_')}_screening_answers.pdf`;
        }
        
        // Try to extract filename from Content-Disposition header as fallback
        if (response.contentDisposition) {
          const matches = response.contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (matches && matches[1] && !jobTitle && !applicantName) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.download = filename;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      }
    },
    onError: (error: any) => {
      const errorMessage = error || 'Failed to download PDF. Please try again.';
    },
  });
  
  return query;
}


export default useDownloadScreeningAnswersPDF;
