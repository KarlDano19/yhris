import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStatus(data: any) {
    const finalData: any = {
      "status": data.status,
      "job_posting": data.job_posting_id
    }
    
    // Include personalized feedback if provided (for rejections)
    if (data.status === 'rejected' && data.feedback) {
      finalData.personalized_feedback = data.feedback;
    }
    
    const token = getCookie('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/update-status/${data.id}/`, {
      method: "PUT",
      
      body: JSON.stringify(finalData),
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    
    return await res.json();
}

function useUpdateStatus() {
  const query = useMutation((data: any) =>
    updateStatus(data)
  );

  return query;
}

export default useUpdateStatus;