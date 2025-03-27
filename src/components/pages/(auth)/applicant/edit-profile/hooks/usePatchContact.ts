import { useMutation } from "@tanstack/react-query";
import { profile } from "console";
import { getCookie } from "cookies-next";

interface T_UserContact{
    id:number
    userId:number
    email:string
    mobileNo:string
    landLineNo:string,
    contactPerson:string
    address:string
    age:number
    contactPersonContactNumber: string
    relationship:string
    contactPersonAge:number
  }
const response = {
  error: false,
  message:"Password Successfully Updated"
}
export async function updateContact(contact:T_UserContact, id:number) {
  const token = getCookie("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
        contact,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return await res.json(); //uncomment this when backend ready
  return response; //remove this when backend ready

}

function usePatchContact(id:number) {
  const query = useMutation((contact:T_UserContact) =>
    updateContact(
      contact,
      id,
)
  );

  return query;
}

export default usePatchContact;