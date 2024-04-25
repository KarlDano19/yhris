import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface T_ProfessionalDetails{
    id:number
    userId: number
    educationLevel: string
    course: string
    yearGraduated: string
    workExperience: string
    skills: [string]
    hobbies: [string]
    haveJob: string
    reasonForApply: string
    currency: string
    salaryFrom: number
    salaryTo: number
  }
const response = {
  error: false,
  message:"Professional Details Successfully Updated"
}
export async function updateProfessionalDetails(profDetails:T_ProfessionalDetails, id:number) {
  const token = getCookie("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professional-details/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
        profDetails,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // return await res.json(); //uncomment this when backend ready
  return response; //remove this when backend ready

}

function usePatchProfessionalDetails(id:number) {
  const query = useMutation((profDetails:T_ProfessionalDetails) =>
    updateProfessionalDetails(
        profDetails,
      id,
)
  );

  return query;
}

export default usePatchProfessionalDetails;