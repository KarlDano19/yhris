import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmailMonitoringLogDetails(audit_log_id: number | null) {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-monitoring/${audit_log_id}/`, config);
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
        throw errStringify.message;
    }
}

function useGetEmailMonitoringLogDetails(audit_log_id: number | null) {
    const query = useQuery(
        ['emailMonitoringLogDetailsCache'],
        () => getEmailMonitoringLogDetails(audit_log_id),
        { enabled: false, refetchOnWindowFocus: false }
    );
    return query;
}

export default useGetEmailMonitoringLogDetails;

