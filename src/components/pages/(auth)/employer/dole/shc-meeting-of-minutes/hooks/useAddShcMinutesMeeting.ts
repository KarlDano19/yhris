import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

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
