import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteWorkEnvironmentRequest(work_environment_measurement_request_id: number | null) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/work-environment-measures/${work_environment_measurement_request_id}/`, config);
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

function useDeleteWorkEnvironmentRequest() {
    const query = useMutation((work_environment_measurement_request_id: number | null) => deleteWorkEnvironmentRequest(work_environment_measurement_request_id));
    return query;
}

export default useDeleteWorkEnvironmentRequest;
