import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_OrgStructureNode = {
  id: number | string;
  position_name?: string | null;
  department_name?: string | null;
  node_type?: 'position' | 'department' | 'unassigned';
  description?: string;
  children?: T_OrgStructureNode[];
};

async function getOrgStructureForHandbook(): Promise<T_OrgStructureNode[]> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/settings/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

// Uses the same PII-free "settings" endpoint the Org Structure settings page uses -
// deliberately not the /org-structures/ manage endpoint, which embeds employee data
// that must never appear in the Policy Handbook (shared reference content).
function useGetOrgStructureForHandbook(enabled: boolean) {
  return useQuery(['orgStructureForHandbookCache'], () => getOrgStructureForHandbook(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled,
  });
}

export default useGetOrgStructureForHandbook;
