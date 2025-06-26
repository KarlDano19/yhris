import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

// Utility to convert dataURL to File
function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

async function addShcMinutesMeeting(data: any) {
  try {
    const token = getCookie("token");
    const formData = new FormData();
    formData.append("time_of_meeting", data.time_of_meeting);
    formData.append("venue", data.venue);
    
    // Validate date_of_meeting format
    const dateOfMeeting = new Date(data.date_of_meeting);
    if (isNaN(dateOfMeeting.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    formData.append("date_of_meeting", dateOfMeeting.toISOString().split('T')[0]); // Format to YYYY-MM-DD

    // Append attendees and absentees as arrays of integers
    data.attendees.forEach((attendee: number) => {
      formData.append("attendees", attendee.toString());
    });
    data.absentees.forEach((absentee: number) => {
      formData.append("absentees", absentee.toString());
    });

    formData.append("details_of_meeting", data.details_of_meeting);
    formData.append("prepared_by", data.prepared_by);
    formData.append("position", data.position);

    // Handle signature
    if (data.signature) {
      if (typeof data.signature === "string" && data.signature.startsWith("data:")) {
        // Drawn signature (data URL)
        const file = dataURLtoFile(data.signature, "signature.png");
        formData.append("signature", file);
      } else if (data.signature instanceof File) {
        // Uploaded file
        formData.append("signature", data.signature);
      }
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/shc-meeting-minutes/`,
      config
    );
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

function useAddShcMinutesMeeting() {
  const query = useMutation((data: any) => addShcMinutesMeeting(data));
  return query;
}

export default useAddShcMinutesMeeting;
