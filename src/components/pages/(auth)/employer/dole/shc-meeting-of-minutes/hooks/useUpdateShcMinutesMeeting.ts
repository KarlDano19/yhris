import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateShcMinutesMeeting(data: any, shc_meeting_minutes_id: number | null) {
    try {
        const token = getCookie("token");

        if (data.date_of_meeting) {
            const dateOfMeeting = new Date(data.date_of_meeting);
            if (!isNaN(dateOfMeeting.getTime())) {
                data.date_of_meeting = dateOfMeeting.toISOString().split("T")[0];
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
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: data instanceof FormData ? data : JSON.stringify(data),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shc-meeting-minutes/${shc_meeting_minutes_id}/`, config);
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

function useUpdateShcMinutesMeeting() {
    const mutation = useMutation((props: any) => updateShcMinutesMeeting(props.data, props.shc_meeting_minutes_id));
    return mutation;
}

export default useUpdateShcMinutesMeeting;
