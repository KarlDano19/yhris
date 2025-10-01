import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface AnalyticsPrintAuditData {
  report_type: string;
}

interface AnalyticsPrintAuditResponse {
  message: string;
  audit_data: Record<string, any>;
}

async function logAnalyticsPrint(data: AnalyticsPrintAuditData): Promise<AnalyticsPrintAuditResponse> {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/print/`, config);
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

function useAddAnalyticsPrintAudit() {
  const mutation = useMutation({
    mutationFn: logAnalyticsPrint,
  });
  return mutation;
}

export default useAddAnalyticsPrintAudit;

