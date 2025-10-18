import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function bulkDeleteHealthAndSafetyReport(health_and_safety_report_ids: number[]) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                health_and_safety_report_ids: health_and_safety_report_ids
            })
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-and-safety-organization-reports/`, config);
        if (!res.ok) {
            throw res.json();
        }
        return res.json();
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, 'response')) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useBulkDeleteHealthAndSafetyReport() {
    const query = useMutation((health_and_safety_report_ids: number[]) => bulkDeleteHealthAndSafetyReport(health_and_safety_report_ids));
    return query;
}

export default useBulkDeleteHealthAndSafetyReport;
