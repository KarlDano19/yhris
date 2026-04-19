import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateQuickAccess(items: string[]): Promise<{ items: string[] }> {
  try {
    const token = getCookie('token');
    const config: any = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ items }),
    };
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quick-access/`, config);
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

function useUpdateQuickAccess() {
  const queryClient = useQueryClient();
  return useMutation((items: string[]) => updateQuickAccess(items), {
    onSuccess: () => {
      queryClient.invalidateQueries(['quickAccessCache']);
    },
  });
}

export default useUpdateQuickAccess;
