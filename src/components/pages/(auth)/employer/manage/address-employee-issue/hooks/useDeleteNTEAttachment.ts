import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

const deleteNTEAttachment = async (employeeIssueId: number) => {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/attachments/${employeeIssueId}/`,
      config
    );
    
    if (!res.ok) {
      throw res.json();
    }
    
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
};

export const useDeleteNTEAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNTEAttachment,
    onSuccess: (data, employeeIssueId) => {
      // Invalidate and refetch employee issue details
      queryClient.invalidateQueries({
        queryKey: ['employee-issue-details', employeeIssueId],
      });
      
      // Also invalidate the employee issues list
      queryClient.invalidateQueries({
        queryKey: ['employee-issues'],
      });
    },
  });
};
