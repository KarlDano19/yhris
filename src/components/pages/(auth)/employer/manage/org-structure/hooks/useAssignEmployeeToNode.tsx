import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface AssignEmployeeData {
  employee_id: number;
  is_primary?: boolean;
}

async function assignEmployeeToNode(orgStructureId: number | string, data: AssignEmployeeData) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/assign-employee/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to assign employee');
      }
      return res.json();
    }
    throw new Error('No authentication token found');
  } catch (err: any) {
    throw new Error(err.message || 'Failed to assign employee');
  }
}

function useAssignEmployeeToNode() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ orgStructureId, employeeId, isPrimary }: { orgStructureId: number | string; employeeId: number; isPrimary?: boolean }) =>
      assignEmployeeToNode(orgStructureId, { employee_id: employeeId, is_primary: isPrimary }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orgStructureManageCache']);
        queryClient.invalidateQueries(['orgStructurePositionEmployees']);
        queryClient.invalidateQueries(['employerProfileCache']);
      },
      onError: (error: Error) => {
        console.error('Failed to assign employee:', error);
      },
    }
  );

  return mutation;
}

export default useAssignEmployeeToNode;
