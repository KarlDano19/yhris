import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function bulkDeleteAnnualMedicalReport(annual_medical_report_ids: number[]) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                annual_medical_report_ids: annual_medical_report_ids
            })
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annual-medical-reports/`, config);
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

function useBulkDeleteAnnualMedicalReport() {
    const query = useMutation((annual_medical_report_ids: number[]) => bulkDeleteAnnualMedicalReport(annual_medical_report_ids));
    return query;
}

export default useBulkDeleteAnnualMedicalReport; 