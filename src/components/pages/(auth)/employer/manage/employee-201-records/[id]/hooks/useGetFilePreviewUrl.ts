'use client';

import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function fetchFilePreviewUrl(fileUrl: string): Promise<string> {
  if (!fileUrl.startsWith('/')) return fileUrl;

  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!res.ok) throw new Error('Failed to load file for preview.');

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

function useGetFilePreviewUrl(fileUrl: string) {
  return useQuery(
    ['filePreviewUrl', fileUrl],
    () => fetchFilePreviewUrl(fileUrl),
    {
      enabled: !!fileUrl,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export default useGetFilePreviewUrl;
