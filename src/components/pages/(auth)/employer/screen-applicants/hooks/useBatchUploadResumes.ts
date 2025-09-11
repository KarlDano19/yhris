import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export async function batchUploadResumes(data: FormData) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: data,
    };

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/batch-upload/`, config);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Batch upload failed');
      }
      
      const result = await res.json();
      
      return result;
    }
    
    throw new Error('No authentication token found');
  } catch (err: any) {
    if (err instanceof Error) {
      throw err;
    }
    
    // Handle other error formats
    let errorMessage = 'Batch upload failed';
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

function useBatchUploadResumes() {
  const query = useMutation((data: FormData) => batchUploadResumes(data));
  return query;
}

export default useBatchUploadResumes;
