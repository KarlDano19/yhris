import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

/** The values the company record (and the employee's, when picked) supplies to a template's linked fields, for the live preview. Nothing is printed or logged. */
async function getDocumentTemplateEmployeeValues(
  templateId: number,
  employeeId: number | null,
  employeeIssueId: number | null
): Promise<Record<string, string>> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/${templateId}/render/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ employee_id: employeeId, employee_issue_id: employeeIssueId, values: {}, preview: true }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load the linked records.');
  }
  const data = await res.json();
  return data.values ?? {};
}

function useGetDocumentTemplateEmployeeValues(templateId: number, employeeId: number | null, employeeIssueId: number | null = null) {
  return useQuery(
    ['documentTemplateEmployeeValuesCache', templateId, employeeId, employeeIssueId],
    () => getDocumentTemplateEmployeeValues(templateId, employeeId, employeeIssueId),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export default useGetDocumentTemplateEmployeeValues;
