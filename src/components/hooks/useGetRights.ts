import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { headers } from 'next/headers';

async function getUserRights() {
    try {
        const token = getCookie('token');
        const config = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        }
        if (token) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rights/`, config);
            if (!res.ok) {
                throw res.json();
            }
            return res.json();
        }
        return {};
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, 'response')) {
            throw errStringify.response.data.message;
        }
        if (Object.hasOwn(errStringify, 'detail')) {
            throw errStringify;
        }
        throw errStringify.message;
    }
}

function useGetRights() {
    const query = useQuery(['userRightsCache'], () => getUserRights(), {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    });

    return query;
}

export default useGetRights;