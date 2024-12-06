import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateOshProgramDetails(data: any) {
    try {
        const token = getCookie("token");

        if (data.date_established) {
            const dateEstablished = new Date(data.date_established);
            if (!isNaN(dateEstablished.getTime())) {
                data.date_established = dateEstablished.toISOString().split("T")[0];
            }
        }

        if (data.date) {
            const dateSigned = new Date(data.date);
            if (!isNaN(dateSigned.getTime())) {
                data.date = dateSigned.toISOString().split("T")[0];
            }
        }

        if (data.signature && data.signature.length) {
            const signatureBlob = await fetch(`${data.signature}`).then((res) => res.blob());
            const formData = new FormData();
            formData.append("signature", signatureBlob, "signature.jpg");
            for (const key in data) {
                if (key !== "signature") {
                    formData.append(key, data[key]);
                }
            }
            data = formData;
        }

        const config = {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`
            },
            body: data instanceof FormData ? data : JSON.stringify(data),
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`, config);
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            throw res.json();
        }

        if (contentType && contentType.includes("application/json")) {
            return res.json();
        } else {
            throw new Error("Response is not JSON");
        }
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, "response")) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useUpdateOshProgramDetails() {
    const query = useMutation((props: any) => updateOshProgramDetails(props.data));
    return query;
}

export default useUpdateOshProgramDetails;

