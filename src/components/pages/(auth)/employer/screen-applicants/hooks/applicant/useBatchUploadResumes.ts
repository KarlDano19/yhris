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
        // Handle 413 Payload Too Large specifically
        if (res.status === 413) {
          throw new Error(
            'The files you are trying to upload are too large. ' +
            'Please try uploading fewer files at once or ensure each file is under 5MB.'
          );
        }

        // Check if response is JSON before parsing
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Batch upload failed');
          } catch (jsonError) {
            // If JSON parsing fails, fall through to generic error
            throw new Error('Upload failed. Please try again with smaller files.');
          }
        } else {
          // Non-JSON response (likely HTML error page from nginx)
          const errorText = await res.text();

          // Try to extract meaningful info from HTML
          if (errorText.includes('413') || errorText.includes('Too Large')) {
            throw new Error(
              'Files are too large to upload. Please reduce file size or upload fewer files at once.'
            );
          }

          // Generic error for other non-JSON responses
          throw new Error(`Upload failed with status ${res.status}. Please try again.`);
        }
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
