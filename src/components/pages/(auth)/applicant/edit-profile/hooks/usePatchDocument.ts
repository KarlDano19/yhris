import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface T_Document{
    id:number
  userId: number
  resume: string
  certificates: string
  videoFile: string
  }
const response = {
  error: false,
  message:"Documents Successfully Updated"
}
export async function updateDocument(document:T_Document, id:number) {
  const token = getCookie("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
        document,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return await res.json(); //uncomment this when backend ready
  return response; //remove this when backend ready

}

function usePatchDocument(id:number) {
  const query = useMutation((document:T_Document) =>
    updateDocument(
        document,
      id,
)
  );

  return query;
}

export default usePatchDocument;