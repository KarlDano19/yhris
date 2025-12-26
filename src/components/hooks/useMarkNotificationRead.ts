import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markNotificationAsRead(notificationId: number) {
    const token = getCookie('token');
    const config = {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
        },
    };

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}/`,
        config
    );

    if (!res.ok) {
        throw new Error('Failed to mark notification as read');
    }

    return res.json();
}

function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation(
        (notificationId: number) => markNotificationAsRead(notificationId),
        {
            onSuccess: () => {
                // Invalidate and refetch notifications
                queryClient.invalidateQueries(['notificationCache']);
            },
        }
    );
}

export default useMarkNotificationRead;
