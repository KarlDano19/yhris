import { useState } from 'react';
import { getCookie } from 'cookies-next';

export default function useResetNteSent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetNteSent = async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ action: 'reset_nte_sent' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to reset NTE sent status');
      }
      return await res.json();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetNteSent, loading, error };
} 