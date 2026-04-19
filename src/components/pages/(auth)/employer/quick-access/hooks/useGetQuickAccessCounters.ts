import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type QuickAccessCounter = {
  count: number;
  label: string;
};

const COUNTER_LABELS: Record<string, string> = {
  'post-job-history': 'active',
  'manage-address-issue': 'pending',
  'manage-memo-policy': 'not sent',
  'manage-employees': 'employees',
};

const COUNTER_ITEM_IDS = new Set(Object.keys(COUNTER_LABELS));

async function getQuickAccessCounts(activeItems: string[]): Promise<Record<string, QuickAccessCounter>> {
  const relevantItems = activeItems.filter((id) => COUNTER_ITEM_IDS.has(id));
  if (relevantItems.length === 0) return {};

  const token = getCookie('token');
  const params = relevantItems.join(',');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quick-access/counts/?items=${params}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) return {};

  const data = await res.json();
  const counters: Record<string, QuickAccessCounter> = {};

  for (const itemId of relevantItems) {
    const count = data[itemId];
    if (count != null) {
      counters[itemId] = { count, label: COUNTER_LABELS[itemId] };
    }
  }

  return counters;
}

function useGetQuickAccessCounters(activeItems: string[]) {
  const relevantItems = activeItems.filter((id) => COUNTER_ITEM_IDS.has(id));
  return useQuery(
    ['quickAccessCountersCache', [...relevantItems].sort().join(',')],
    () => getQuickAccessCounts(activeItems),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
      enabled: relevantItems.length > 0,
    }
  );
}

export default useGetQuickAccessCounters;
