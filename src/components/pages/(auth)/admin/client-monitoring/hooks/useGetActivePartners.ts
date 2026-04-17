import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getActivePartners() {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/partners/?is_active=true`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch partners.');
  const data = await res.json();
  return Array.isArray(data) ? data : data.records ?? [];
}

function useGetActivePartners() {
  return useQuery(['activePartnersCache'], getActivePartners, {
    refetchOnWindowFocus: false,
  });
}

export default useGetActivePartners;
