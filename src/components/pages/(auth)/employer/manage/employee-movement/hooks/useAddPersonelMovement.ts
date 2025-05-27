import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addPersonelMovement(data: any) {
    try {
        const token = getCookie("token");
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            if (!isNaN(startDate.getTime())) {
                data.start_date = startDate.toISOString().split("T")[0];
            }
        }

        if (data.hr_signature && data.hr_signature.length) {
            const signatureBlob = await fetch(`${data.hr_signature}`).then((res) => res.blob());
            const formData = new FormData();
            formData.append('hr_signature', signatureBlob, 'hr_signature.jpg');
            for (const key in data) {
                if (key !== 'hr_signature') {
                    formData.append(key, data[key]);
                }
            }
            data = formData;
        }
        
        if (data.manager_signature && data.manager_signature.length) {
            const signatureBlob = await fetch(`${data.manager_signature}`).then((res) => res.blob());
            const formData = new FormData();
            formData.append('manager_signature', signatureBlob, 'manager_signature.jpg');
            for (const key in data) {
                if (key !== 'manager_signature') {
                    formData.append(key, data[key]);
                }
            }
            data = formData;
        }
        
        const config = {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: data instanceof FormData ? data : JSON.stringify(data),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/`, config);
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

function useAddPersonelMovement() {
    const query = useMutation((data: any) => addPersonelMovement(data));
    return query;
}

export default useAddPersonelMovement;
