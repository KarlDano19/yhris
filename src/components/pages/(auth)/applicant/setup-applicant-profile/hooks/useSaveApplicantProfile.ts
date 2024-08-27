
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";


async function saveApplicantProfile(data: any, id:number) {
  try {
    const token = getCookie('token');
    console.log(data)
    const config = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/profiles/${id}/`,
      config
    ); // change URI
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

function useSaveApplicantProfile(id:number) {
  const query = useMutation((data: any) => saveApplicantProfile(data, id));
  return query;
}

export default useSaveApplicantProfile;