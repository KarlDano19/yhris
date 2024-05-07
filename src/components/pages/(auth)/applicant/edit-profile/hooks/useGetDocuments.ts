import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const documents = {
  id:1,
  userId: 93,
  resume: "Resume.pdf",
  certificates: "Certificates.pdf",
  videoFile: "my-video.mp4",
};

async function getDocuments(id: any) {
  try {
    // const token = getCookie("token");
    // const config = {
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //     Authorization: `Token ${token}`,
    //   },
    // };
    // if (token) {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}`, // change URI
    //     config
    //   );
    //   if (!res.ok) {
    //     throw res.json();
    //   }
    //   return res.json();
    // }
    return documents;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetDocuments(id: any) {
  const query = useQuery(["getDocumentsCache", id], () => getDocuments(id), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetDocuments;
