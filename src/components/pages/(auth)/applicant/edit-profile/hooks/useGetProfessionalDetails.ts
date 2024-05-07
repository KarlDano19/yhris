import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const data = {
  id:1,
  userId: 93,
  educationLevel: "College Graduate",
  course: "BS in Computer Science",
  yearGraduated: "2018",
  workExperience: "Freelance",
  skills: ["HTML", "CSS", "JavaScript"],
  hobbies: ["Coding", "Video Games", "Musical Instruments"],
  haveJob: "Yes",
  reasonForApply: "To have more income",
  currency: "PHP",
  salaryFrom: 20000,
  salaryTo: 50000,
};

async function getProfessionalDetails(id: any) {
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
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/professional-details/${id}`, // change URI
    //     config
    //   );
    //   if (!res.ok) {
    //     throw res.json();
    //   }
    //   return res.json();
    // }
    return data;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetProfessionalDetails(id: any) {
  const query = useQuery(["findJobsCache"], () => getProfessionalDetails(id), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetProfessionalDetails;
