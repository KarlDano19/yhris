import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export async function sendEmail(data: any) {
  try {
    const token = getCookie("token");
    let config: any = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // If data is FormData (has attachment), use it directly
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      config.body = data;
      // Do NOT set content-type header for FormData!
    } else {
      config.headers["content-type"] = "application/json";
      config.body = JSON.stringify({
        bcc: data.bcc,
        cc: data.cc,
        subject: `Safety and Health Policy Document`,
        to: data.to,
        context: data.message,
      });
    }

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/safety-and-health-policies/send-email/`,
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
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSendEmail() {
  const query = useMutation((data: any) => sendEmail(data));
  return query;
}

export default useSendEmail;
