import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteApproval(approval_id: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/approval-stages/${approval_id}/`,
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
    throw errStringify.message;
  }
}

function useDeleteApproval() {
  const query = useMutation((approval_id: any) =>
    deleteApproval(approval_id)
  );

  return query;
}

export default useDeleteApproval;
