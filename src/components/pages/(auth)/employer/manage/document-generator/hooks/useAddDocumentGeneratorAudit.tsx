import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DocumentPrintAuditData {
  document_type: string;
  document_data: Record<string, any>;
}

interface DocumentPrintAuditResponse {
  message: string;
  audit_data: Record<string, any>;
}

async function logDocumentPrint(data: DocumentPrintAuditData): Promise<DocumentPrintAuditResponse> {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-generator/print/`, config);
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

function useDocumentGeneratorAudit() {
  const mutation = useMutation({
    mutationFn: logDocumentPrint,
  });
  return mutation;
}

export default useDocumentGeneratorAudit;
