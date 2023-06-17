import { Dispatch } from "react";
import { T_CreateJob } from "@/types/globals";
import toast from 'react-hot-toast';
import CustomToast from "@/components/CustomToast";

function CopyJob({
  item,
  setIsOpen,
}: {
  item: T_CreateJob;
  setIsOpen: Dispatch<boolean>;
}) {

  const handleCopy = () => {
    const {
      id,
      JobNo,
      isActive,
      language,
      jobTitle,
      placeAdvertise,
      jobType,
      schedule,
      hireCount,
      hireDate,
      country,
      salary,
      rate,
      benefits,
      jobDescription,
      postAs,
      postIn,
    } = item;

    const mergedData = `
      Job Id: ${id}
      Job Number: ${JobNo}
      Hire Date: ${hireDate}
      Active: ${isActive}
      Country: ${country}
      Language: ${language}
      Job Title: ${jobTitle}
      Place of Advertise: ${placeAdvertise}
      Job Type: ${jobType}
      Job Schedule: ${schedule}
      Hire Count: ${hireCount}
      Salary Type: ${salary.salaryType}
      Salary Value: ${salary.salaryValue}
      Rate: ${rate}
      Job Description: ${jobDescription}
      Salary Benefits: ${benefits.join(", ")}
      postAs: ${postAs}
      postIn: ${postIn.join(", ")}
    `;
    navigator.clipboard.writeText(mergedData);
    toast.custom(
      () => <CustomToast message={`Job ${jobTitle} was copied!`} type="success" />,
      { duration: 1000 }
    );
    setIsOpen(false);
  };

  return (
    <button
      className="block w-full px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
      onClick={handleCopy}
      data-id={item.id} // Add the ID as a data attribute
    >
      Copy a Job
    </button>
  );
}

export default CopyJob;
