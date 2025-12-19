import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getNotifications() {
    try {
        const token = getCookie('token');
        const config = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };
        if (token) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, config);
            if (!res.ok) {
                throw res.json();
            }
            return res.json();
        }
        return [];
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, 'response')) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useGetNotification() {
    const query = useQuery(['notificationCache'], () => getNotifications(), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchInterval: 10000, // Refetch every 10 seconds
    });
    return query;
}

export default useGetNotification;