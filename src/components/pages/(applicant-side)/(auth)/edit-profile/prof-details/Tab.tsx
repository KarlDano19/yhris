"use client";
import DropDownArrow from "@/svg/DropDownArrow";
import Link from "next/link";
import useGetProfessionalDetails from "../hooks/useGetProfessionalDetails";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import usePatchProfessionalDetails from "../hooks/usePatchProfessionalDetails";
import { Button } from "react-bootstrap";

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

const Tab = () => {
  const { data, isLoading } = useGetProfessionalDetails(1);
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<T_ProfessionalDetails>()
  const {mutate:mutateProfDetails, isLoading:mutateIsLoading} = usePatchProfessionalDetails(93)
  const onSubmit = (data: T_ProfessionalDetails) => {

    const callBackReq = {
      onSuccess: (data: any) => {
         if(!data.error){
          toast.success("Professional Details Successfully Updated")
          router.push("/apply-for-a-job")
         }
      },
      onError: (err: any) => {
        //toast.error(String(err)) //uncooment this if backend is ready
       toast.success("Professional Details Successfully Updated") //remove this when backend is ready
       router.push("/apply-for-a-job") //remove this when backend is ready
      },
    }
  
    mutateProfDetails(data, callBackReq)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-12">
            <div className="grid-item">
              <label
                htmlFor="education"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Education Level <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <select
                  id="education"
                  {...register("educationLevel")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.educationLevel : ""}
                >
                  <option value={"College Graduate"}>College Graduate</option>
                  <option value={"Highschool Graduate"}>Highschool Graduate</option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="course"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Course <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("course")}
                  id="course"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.course : ""}
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="year-graduated"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Year Graduated <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("yearGraduated")}
                  id="year-graduated"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.yearGraduated : ""}
                />
              </div>
            </div>
            <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6">
              Work Experience <span className="text-red-500">*</span>
            </h6>
            <div className="grid-item">
              <button
                type="button"
                className="rounded-md mt-4 md:mt-7 bg-[#65C979] px-10 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add a Job
              </button>
              <div className="mt-3.5">
                <input
                  type="text"
                 {...register("workExperience")}
                  id="job"
                  className="rounded-md w-full border-0 px-3 py-1.5 bg-indigo-dye text-center text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  placeholder="Job 1"
                  defaultValue={!isLoading ? data?.workExperience : ""}
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="skills"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                 {...register("skills")}
                  id="skills"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.skills ? data?.skills.join(", ") : "" : ""}
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="hobbies"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Hobbies & Interests
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                  {...register("hobbies")}
                  id="hobbies"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.hobbies ? data?.hobbies.join(", ") : "" : ""}
                />
              </div>
            </div>
            <div className="grid-item md:col-span-1 mt-4 md:mt-16">
              <label
                htmlFor="current-job"
                className="whitespace-nowrap text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Do you currently have a job?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <select
                  id="current-job"
                  {...register("haveJob")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.haveJob : ""}
                >
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item md:col-span-2 mt-4 md:mt-16">
              <label
                htmlFor="apply-reason"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                If yes, why are you applying for a job?
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("reasonForApply")}
                  id="apply-reason"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.reasonForApply : ""}
                />
              </div>
            </div>
            <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6 mb-2">
              Expected Monthly Salary
            </h6>
            <div className="grid-item md:col-span-1">
              <label
                htmlFor="currency"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Currency
              </label>
              <div className="relative mt-2">
                <select
                  id="currency"
                 {...register("currency")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue={!isLoading ? data?.currency : ""}
                >
                  <option value={"PHP"}>PHP</option>
                  <option value={"USD"}>USD</option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0 md:col-span-2">
              <label
                htmlFor="salary-range"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Salary Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-x-12 relative">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register("salaryFrom")}
                    id="salary-range"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    defaultValue={!isLoading ? data?.salaryFrom : ""}
                  />
                  <span className="absolute text-indigo-dye top-[13px] ml-4">
                    to
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    {...register("salaryTo")}
                    id="to"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    defaultValue={!isLoading ? data?.salaryTo : ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="mt-10 md:mt-12 w-full md:w-auto text-center float-right mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
           
          >
             {mutateIsLoading ? (
                          <div
                            className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "SAVE"
                        )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Tab;
