import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStatus(data: any) {
    const finalData: any = {
      "status": data.status,
      "job_posting": data.job_posting_id,
      "stage_notes": data.stage_notes
    }
    
    // Include checklist data if provided
    if (data.checklists) {
      finalData.checklists = data.checklists;
    }
    
    // Include new_required_slot if provided (for hiring with slot increase)
    if (data.new_required_slot) {
      finalData.new_required_slot = data.new_required_slot;
    }
    
    // Include deactivate_job_posting if provided (for manual deactivation)
    if (data.deactivate_job_posting) {
      finalData.deactivate_job_posting = data.deactivate_job_posting;
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