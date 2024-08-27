import { useMutation } from "@tanstack/react-query";
import { profile } from "console";
import { getCookie } from "cookies-next";

interface T_UserProfile{
  id:number
    userId:number
    name:string
    about:string
    profilePicture:string
    birthDay:string
    age:number
    gender:string
    religion:string
    nationality:string
    civilStatus:string
    houseNo:string
    street:string
    townBrgy:string
    city:string
    zipCode:string
    country:string
}
const response = {
  error: false,
  message:"Password Successfully Updated"
}
export async function updateProfile(profile:T_UserProfile, id:number) {
  const token = getCookie("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({
      profile,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return await res.json();
  return response;

}

function usePatchProfile(id:number) {
  const query = useMutation((profile:T_UserProfile) =>
    updateProfile(
      profile,
      id,
)
  );

  return query;
}

export default usePatchProfile;