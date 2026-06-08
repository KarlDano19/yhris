import { useState } from 'react';
import { getCookie } from 'cookies-next';

function useExportSeparation() {
  const [isExporting, setIsExporting] = useState(false);

  const exportSeparation = async (separationId: number | string, filename?: string) => {
    setIsExporting(true);
    try {
      const token = getCookie('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationId}/export/`,
        {
          method: 'GET',
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (!res.ok) throw new Error('Export failed.');
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const downloadName = match?.[1] || filename || `separation_${separationId}.zip`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportSeparation, isExporting };
}

export default useExportSeparation;
