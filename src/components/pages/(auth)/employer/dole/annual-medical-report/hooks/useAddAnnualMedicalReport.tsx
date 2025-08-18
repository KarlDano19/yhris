import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addAnnualMedicalReport(data: any) {
    try {
        const token = getCookie("token");

        if (data.date_of_report) {
            const reportDate = new Date(data.date_of_report);
            if (!isNaN(reportDate.getTime())) {
                // Adjust for timezone offset to preserve local date
                const offset = reportDate.getTimezoneOffset();
                const adjustedDate = new Date(reportDate.getTime() - offset * 60000);
                data.date_of_report = adjustedDate.toISOString().split("T")[0];
            }
        }

        // Always use FormData for consistency
        const formData = new FormData();
        
        // Handle signature if present
        if (data.signature) {
            if (data.signature instanceof File) {
                // If it's already a File object, use it directly
                formData.append('signature', data.signature);
            } else if (typeof data.signature === 'string' && data.signature.startsWith('data:')) {
                // If it's a data URL (from drawing)
                const signatureBlob = await fetch(data.signature).then((res) => res.blob());
                formData.append('signature', signatureBlob, 'signature.png');
            }
        }

        // Handle noted signature if present
        if (data.noted_signature) {
            if (data.noted_signature instanceof File) {
                // If it's already a File object, use it directly
                formData.append('noted_signature', data.noted_signature);
            } else if (typeof data.noted_signature === 'string' && data.noted_signature.startsWith('data:')) {
                // If it's a data URL (from drawing)
                const notedSignatureBlob = await fetch(data.noted_signature).then((res) => res.blob());
                formData.append('noted_signature', notedSignatureBlob, 'noted_signature.png');
            }
        }
        
        // Add all other form fields
        for (const key in data) {
            if (key !== 'signature' && key !== 'noted_signature') {
                formData.append(key, data[key]);
            }
        }

        const config = {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: formData,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annual-medical-reports/`, config);
        if (!res.ok) {
            throw res.json();
        }
        return res.json();
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, "response")) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useAddAnnualMedicalReport() {
    const query = useMutation((data: any) => addAnnualMedicalReport(data));
    return query;
}

export default useAddAnnualMedicalReport;
