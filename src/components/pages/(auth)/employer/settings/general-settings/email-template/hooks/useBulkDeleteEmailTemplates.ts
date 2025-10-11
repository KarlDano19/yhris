import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteEmailTemplates = async (emailTemplateIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-templates/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_template_ids: emailTemplateIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete email templates');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEmailTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEmailTemplates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplateItems'] });
    },
  });
} 