import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteShcMinutesMeeting = async (shcMinutesMeetingIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shc-meeting-minutes/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shc_meeting_minutes_ids: shcMinutesMeetingIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete SHC minutes of meeting');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteShcMinutesMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteShcMinutesMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shcMinutesMeetingItems'] });
    },
  });
} 