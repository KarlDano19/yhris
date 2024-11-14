import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export async function sendEmail(data: any) {
  try {
    const token = getCookie("token");
    const payloads = {
      bcc: data.bcc,
      cc: data.cc,
      subject: `Work Environment Measurement Request`,
      to: data.to,
      context: data.message,
    };
    const config = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payloads),
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-environment-measures/send-email/`,
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
