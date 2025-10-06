import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateSafetyAndHealthPolicy(data: any) {
    try {
        const token = getCookie("token");
        const formData = new FormData();

        // Check if this is a status-only update
        const isStatusOnlyUpdate = data.status !== undefined && Object.keys(data).length <= 2;

        // Append all fields to formData, but skip attachment fields for status-only updates
        for (const key in data) {
            if (data[key] !== undefined) {
                // Skip attachment fields for status-only updates
                if (isStatusOnlyUpdate && (key === 'attachment' || key === 'attachments')) {
                    continue;
                }
                
                // Handle null values explicitly (especially for attachment deletion)
                if (data[key] === null) {
                    formData.append(key, ''); // Send empty string instead of null
                } else {
                    formData.append(key, data[key]);
                }
            }
        }

        const config = {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
                // Do NOT set Content-Type here; browser will set it with the correct boundary
            },
            body: formData,
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/safety-and-health-policies/`, config);
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

function useUpdateSafetyAndHealthPolicy() {
    const query = useMutation((props: any) => updateSafetyAndHealthPolicy(props.data));
    return query;
}

export default useUpdateSafetyAndHealthPolicy;

