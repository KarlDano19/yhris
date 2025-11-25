import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEmployeeStatusToYP(employeeStatusData: { id: string; data: any }) {
  const token = getCookie('token');
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(employeeStatusData.data),
  };
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-status/sync-create/`, config);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add employee status to YP');
  }
  
  return res.json();
}

function useAddEmployeeStatusToYP() {
  const query = useMutation({
    mutationFn: (employeeStatusData: { id: string; data: any }) => addEmployeeStatusToYP(employeeStatusData)
  });

  return query;
}

export default useAddEmployeeStatusToYP;
