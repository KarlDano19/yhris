import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export async function sendInterviewSchedule(data: any) {
  try {
    const token = getCookie('token');
    let payloads: any = {
      applicant_id: data.applicantId,
      date: data.date,
      start_time: data.startTime,
      duration: data.duration,
      to: data.emails,
      message: data.message,
    };
    if (data.selectionId == 'video') {
      payloads['platform'] = data.platform;
      payloads['integrated_id'] = parseInt(data.integrated_id);
    } else if (data.selectionId == 'phone') {
      payloads['phone_number'] = data.phoneNumber;
    } else {
      payloads['latitude'] = data.coordinates.lat.toString();
      payloads['longitude'] = data.coordinates.lng.toString();
    }
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payloads),
    };
    debugger
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/send-interview-schedule/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return;
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSendInterviewSchedule() {
  const query = useMutation((data: any) => sendInterviewSchedule(data));
  return query;
}

export default useSendInterviewSchedule;
