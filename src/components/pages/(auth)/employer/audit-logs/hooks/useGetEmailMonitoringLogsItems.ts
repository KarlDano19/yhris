import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface newFiltersProps {
    search?: string;
    from?: string;
    to?: string;
    action?: string;
    user_id?: string | number;
    module?: string;
    current_page?: number;
    page_size?: number;
}

async function getEmailMonitoringLogsItems(filters: any) {
    try {
        let newFilters: newFiltersProps = {};
        if (filters.currentPage) newFilters.current_page = filters.currentPage;
        if (filters.pageSize) newFilters.page_size = filters.pageSize;
        if (filters.search) newFilters.search = filters.search;
        if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
        if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
        if (filters.action) newFilters.action = filters.action;
        if (filters.user) newFilters.user_id = filters.user;
        if (filters.module) newFilters.module = filters.module;
        if (!newFilters.from) delete newFilters.from;
        if (!newFilters.to) delete newFilters.to;
        if (!filters.action) delete newFilters.action;
        if (!filters.user) delete newFilters.user_id;
        if (!filters.module) delete newFilters.module;
        const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
        const token = getCookie('token');
        const config = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };
        if (token) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-monitoring/history/?${searchParams}`, config);
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

function useGetEmailMonitoringLogsItems(filters: any) {
    const query = useQuery(
        [
            'emailMonitoringLogsItemsCache',
            filters.currentPage,
            filters.pageSize,
            filters.search,
            filters.from,
            filters.to,
            filters.action,
            filters.user,
            filters.module,
        ],
        () => getEmailMonitoringLogsItems(filters),
        { 
            refetchOnWindowFocus: false,
            keepPreviousData: true 
        }
    );
    return query;
}

export default useGetEmailMonitoringLogsItems;

