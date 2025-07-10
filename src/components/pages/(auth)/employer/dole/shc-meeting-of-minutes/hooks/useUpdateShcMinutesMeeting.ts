import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateShcMinutesMeeting(data: any, shc_meeting_minutes_id: number | null) {
    try {
        const token = getCookie("token");

        if (data.date_of_meeting) {
            const dateOfMeeting = new Date(data.date_of_meeting);
            if (!isNaN(dateOfMeeting.getTime())) {
                // Adjust for timezone offset to preserve local date
                const offset = dateOfMeeting.getTimezoneOffset();
                const adjustedDate = new Date(dateOfMeeting.getTime() - offset * 60000);
                data.date_of_meeting = adjustedDate.toISOString().split("T")[0];
            }
        }

        if (data.date_filled) {
            const dateFilled = new Date(data.date_filled);
            if (!isNaN(dateFilled.getTime())) {
                // Adjust for timezone offset to preserve local date
                const offset = dateFilled.getTimezoneOffset();
                const adjustedDate = new Date(dateFilled.getTime() - offset * 60000);
                data.date_filled = adjustedDate.toISOString().split("T")[0];
            }
        }

        // Always use FormData for consistency
        const formData = new FormData();
        
        // Handle signature if present and not a string (existing URL)
        if (data.signature && typeof data.signature !== 'string') {
          if (data.signature instanceof File) {
            // If it's already a File object, use it directly
            formData.append('signature', data.signature);
          } else if (typeof data.signature === 'string' && data.signature.startsWith('data:')) {
            // If it's a data URL (from drawing)
            const signatureBlob = await fetch(data.signature).then((res) => res.blob());
            formData.append('signature', signatureBlob, 'signature.png');
          }
        }
        
        // Add all other form fields
        for (const key in data) {
          if (key !== 'signature') {
            if (key === 'attendees' && Array.isArray(data[key])) {
              // Append attendees as array of integers
              data[key].forEach((attendee: number) => {
                formData.append("attendees", attendee.toString());
              });
            } else if (key === 'absentees' && Array.isArray(data[key])) {
              // Append absentees as array of integers
              data[key].forEach((absentee: number) => {
                formData.append("absentees", absentee.toString());
              });
            } else {
              formData.append(key, data[key]);
            }
          }
        }

        const config = {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: formData,
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
