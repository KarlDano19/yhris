import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function downloadSignedKickoffForm(id: number) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/${id}/acknowledgement/download/`,
    {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to download the signed form.');
  }

  return {
    blob: await res.blob(),
    contentDisposition: res.headers.get('Content-Disposition'),
  };
}

function useDownloadSignedKickoffForm() {
  return useMutation((id: number) => downloadSignedKickoffForm(id), {
    onSuccess: (response) => {
      if (!response?.blob) return;

      // Resolve the filename from Content-Disposition, fallback to a generic name
      let filename = 'annex-a-signed-form.pdf';
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

export default useDownloadSignedKickoffForm;
