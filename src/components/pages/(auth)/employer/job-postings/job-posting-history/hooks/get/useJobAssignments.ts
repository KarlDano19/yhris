import { useQuery, useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Get available users for assignment
async function getAvailableUsers() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/available-users/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

// Get assignments for a specific job posting
async function getJobAssignments(jobPostingId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/assignments/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

// Assign users to job posting
async function assignUsersToJob(data: { 
  jobPostingId: number; 
  assigned_users: number[];
  can_view?: boolean;
  can_edit?: boolean;
  can_view_applicants?: boolean;
}) {
  try {
    const token = getCookie('token');
    const { jobPostingId, ...payload } = data;
    
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/assignments/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

// Custom hooks
export function useGetAvailableUsers() {
  const query = useQuery(['availableUsersCache'], () => getAvailableUsers(), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return query;
}

export function useGetJobAssignments(jobPostingId: number) {
  const query = useQuery(
    ['jobAssignmentsCache', jobPostingId], 
    () => getJobAssignments(jobPostingId), 
    {
      enabled: !!jobPostingId,
      refetchOnWindowFocus: false,
    }
  );
  return query;
}

export function useAssignUsersToJob() {
  const mutation = useMutation(assignUsersToJob);
  return mutation;
}
