import { useMutation } from "@tanstack/react-query";
import { T_UserPassword } from "@/types/globals";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
const response = {
  error: false,
  message:"Password Successfully Updated"
}
export async function updatePassword(data: T_UserPassword) {
  const token = getCookie("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/`, {
    method: "POST",
    body: JSON.stringify({
      code: data.code,
      password: data.password
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  const responseJson = await res.json()
  
  
  return responseJson;

}

function useUpdatePassword() {
  const query = useMutation((data: T_UserPassword) =>
    updatePassword(data)
  );

  return query;
}

export default useUpdatePassword;
