import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getAuditLogDetails(audit_log_id: number | null) {
    try {
        const token = getCookie('token');
        
        if (!token) {
            return {};
        }

        const config = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs/${audit_log_id}/`;

        const res = await fetch(url, config);

        if (!res.ok) {
            throw await res.json();
        }

        const responseData = await res.json();

        return responseData.data || responseData;
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, 'response')) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useGetAuditLogDetails(audit_log_id: number | null) {
    const query = useQuery(
        ['auditLogDetailsCache', audit_log_id],
        () => getAuditLogDetails(audit_log_id),
        {
            enabled: false,
            refetchOnWindowFocus: false,
            retry: false
        }
    );
    return query;
}

export default useGetAuditLogDetails;
