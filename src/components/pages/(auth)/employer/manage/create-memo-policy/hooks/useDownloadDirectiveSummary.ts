import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DirectiveSummaryFilters {
  from?: Date | string;
  to?: Date | string;
  search?: string;
  directiveType?: string;
}

async function downloadDirectiveSummary(filters: DirectiveSummaryFilters) {
  // Same query params as the table (see useGetDirectivesItems), plus view_type=export
  const params: Record<string, string> = { view_type: 'export' };
  if (filters.from instanceof Date) params.from = filters.from.toLocaleDateString('en-CA');
  if (filters.to instanceof Date) params.to = filters.to.toLocaleDateString('en-CA');
  if (filters.search) params.search = filters.search;
  if (filters.directiveType) params.directive_type = filters.directiveType;

  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/directives/?${new URLSearchParams(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to download the summary.');
  }

  return {
    blob: await res.blob(),
    contentDisposition: res.headers.get('Content-Disposition'),
  };
}

function useDownloadDirectiveSummary() {
  return useMutation((filters: DirectiveSummaryFilters) => downloadDirectiveSummary(filters), {
    onSuccess: (response) => {
      if (!response?.blob) return;

      // Resolve the filename from Content-Disposition, fallback to a generic name
      let filename = 'memo-policy-summary.csv';
      if (response.contentDisposition) {
        const matches = response.contentDisposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) filename = matches[1];
      }

      // Trigger the browser download
      const url = window.URL.createObjectURL(response.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

export default useDownloadDirectiveSummary;
