import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unassignEmployeeFromNode(orgStructureId: number | string, employeeId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ employee_id: employeeId }),
    };

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/assign-employee/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to unassign employee');
      }
      return res.json();
    }
    throw new Error('No authentication token found');
  } catch (err: any) {
    throw new Error(err.message || 'Failed to unassign employee');
  }
}

function useUnassignEmployeeFromNode() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ orgStructureId, employeeId }: { orgStructureId: number | string; employeeId: number }) =>
      unassignEmployeeFromNode(orgStructureId, employeeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orgStructureManageCache']);
        queryClient.invalidateQueries(['orgStructurePositionEmployees']);
        queryClient.invalidateQueries(['employerProfileCache']);
      },
      onError: (error: Error) => {
        console.error('Failed to unassign employee:', error);
      },
    }
  );

  return mutation;
}

export default useUnassignEmployeeFromNode;
