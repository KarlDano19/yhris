import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Delete a single notification
async function deleteNotification(notificationId: number) {
    const token = getCookie('token');
    const config = {
        method: 'DELETE',
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
        throw new Error('Failed to delete notification');
    }

    return res.json();
}

// Delete all read notifications
async function deleteAllReadNotifications() {
    const token = getCookie('token');
    const config = {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
        },
    };

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read/bulk-delete/`,
        config
    );

    if (!res.ok) {
        throw new Error('Failed to delete all read notifications');
    }

    return res.json();
}

// Hook for deleting a single notification
export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation(
        (notificationId: number) => deleteNotification(notificationId),
        {
            onSuccess: () => {
                // Invalidate and refetch notifications
                queryClient.invalidateQueries(['notificationCache']);
            },
        }
    );
}

// Hook for deleting all read notifications
export function useDeleteAllReadNotifications() {
    const queryClient = useQueryClient();

    return useMutation(
        () => deleteAllReadNotifications(),
        {
            onSuccess: () => {
                // Invalidate and refetch notifications
                queryClient.invalidateQueries(['notificationCache']);
            },
        }
    );
}

export default useDeleteNotification;
