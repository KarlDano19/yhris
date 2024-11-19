import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateSafetyAndHealthPolicy(data: any) {
    try {
        const token = getCookie("token");
        const config = {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
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

