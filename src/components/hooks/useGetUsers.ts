import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getUsers() {
    try {
        let newFilters = { view_type: 'select' };
        const searchParams = new URLSearchParams(newFilters);
        const token = getCookie('token');
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };
        if (token) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/?${searchParams}`, config);
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

function useGetUsers() {
    const query = useQuery(['usersCache'], () => getUsers(), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    });

    return query;
}

export default useGetUsers;
