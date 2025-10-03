import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function bulkDeleteWorkEnvironmentRequest(work_environment_measure_ids: number[]) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                work_environment_measure_ids: work_environment_measure_ids
            })
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/work-environment-measures/`, config);
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

function useBulkDeleteWorkEnvironmentRequest() {
    const query = useMutation((work_environment_measure_ids: number[]) => bulkDeleteWorkEnvironmentRequest(work_environment_measure_ids));
    return query;
}

export default useBulkDeleteWorkEnvironmentRequest; 