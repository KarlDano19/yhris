import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface OrgStructureExportAuditData {
  export_format: string;
  export_data: Record<string, any>;
}

interface OrgStructureExportAuditResponse {
  message: string;
  audit_data: Record<string, any>;
}

async function logOrgStructureExport(data: OrgStructureExportAuditData): Promise<OrgStructureExportAuditResponse> {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structure/export/`, config);
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

function useOrgStructureExportAudit() {
  const mutation = useMutation({
    mutationFn: logOrgStructureExport,
  });
  return mutation;
}

export default useOrgStructureExportAudit;

