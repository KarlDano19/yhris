import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const jobs = [
  {
    id: 1,
    title: "Front-End Developer",
    company: "Accenture",
    location: "Muntinlupa",
    isNew: true,
  },
  {
    id: 2,
    title: "Back-End Developer",
    company: "Google",
    location: "Chicago",
    isNew: false,
  },
];

async function findJobs(jobTitle: string, location: string) {
  // try {
  //   const token = getCookie("token");
  //   const config = {
  //     method: "GET",
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Token ${token}`,
  //     },
  //   };
  //   if (token) {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?jobTitle=${jobTitle}&location=${location}`, // change URI
  //       config
  //     );
  //     if (!res.ok) {
  //       throw res.json();
  //     }
  //     return res.json();
  //   }
  //   return jobs;
  // } catch (err: any) {
  //   let errStringify = await err;
  //   if (Object.hasOwn(errStringify, "response")) {
  //     throw errStringify.response.data.message;
  //   }
  //   throw errStringify.message;
  // }
  return jobs;
}

function useFindJobs(jobTitle: string, location: string) {
  const query = useQuery(
    ["findJobsCache"],
    () => findJobs(jobTitle, location),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useFindJobs;
