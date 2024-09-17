import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const jobDetails = [
  {
    id: 1,
    title: "Front-End Developer",
    company: "Accenture",
    companyPicture: "A",
    location: "Muntinlupa",
    role: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    jobDetails: {
      qualifications: [
        "Must have atleast 2 years experience in front-end development.",
        "Able to use framework such as Next.js, React.js, etc.",
      ],
      jobType: ["Full-time", "Flexitime", "Contractual"],
      schedule: ["8 hours", "Day Shift"],
      currencyType: "PHP",
      salaryFrom: "20,000",
      salaryTo: "30,000",
      benefits: ["Free premium Udemy accounts", "13th month pay"],
    },
    isNew: true,
  },
  {
    id: 2,
    title: "Back-End Developer",
    company: "Google",
    companyPicture: "G",
    location: "Chicago",
    role: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    jobDetails: {
      qualifications: [
        "Must have atleast 4 years experience in back-end development.",
        "Able to use framework such as Laravel, Express.js, etc.",
        "Bachelor Degree of Computer Science/IT.",
      ],
      jobType: ["Full-time"],
      schedule: ["8 hours", "Day Shift", "Night Shift"],
      currencyType: "PHP",
      salaryFrom: "50,000",
      salaryTo: "100,000",
      benefits: [
        "Free google premium subscriptions.",
        "Health card.",
        "Trip to vegas.",
      ],
    },
    isNew: false,
  },
];

async function getJobDetails(jobId: any) {
  const job = jobDetails.find((job) => job.id === jobId);
  try {
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`, // change URI
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }

    return job;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetJobDetails(jobId: any) {
  const query = useQuery(
    ["getJobDetailsCache", jobId],
    () => getJobDetails(jobId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetJobDetails;
