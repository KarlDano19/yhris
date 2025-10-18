import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function bulkDeleteEmployeeCompensationLogbook(employee_compensation_logbook_ids: number[]) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                employee_compensation_logbook_ids: employee_compensation_logbook_ids
            })
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-compensation-logbooks/`, config);
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

function useBulkDeleteEmployeeCompensationLogbook() {
    const query = useMutation((employee_compensation_logbook_ids: number[]) => bulkDeleteEmployeeCompensationLogbook(employee_compensation_logbook_ids));
    return query;
}

export default useBulkDeleteEmployeeCompensationLogbook; 