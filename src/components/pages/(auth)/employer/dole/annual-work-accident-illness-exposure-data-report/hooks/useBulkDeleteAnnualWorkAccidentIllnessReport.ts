    import { useMutation } from '@tanstack/react-query';
    import { getCookie } from 'cookies-next';

    async function bulkDeleteAnnualWorkAccidentIllnessReport(annual_work_accident_illness_report_ids: number[]) {
        try {
            const token = getCookie('token');
            const config = {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    annual_work_accident_illness_report_ids: annual_work_accident_illness_report_ids
                })
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annual-work-accident-illness-reports/`, config);
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

    function useBulkDeleteAnnualWorkAccidentIllnessReport() {
        const query = useMutation((annual_work_accident_illness_report_ids: number[]) => bulkDeleteAnnualWorkAccidentIllnessReport(annual_work_accident_illness_report_ids));
        return query;
    }

    export default useBulkDeleteAnnualWorkAccidentIllnessReport;
