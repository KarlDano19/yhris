"use client";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import VideoRecorder from "../../setup-applicant-profile/VideoRecorder";
import { useState } from "react";
import useGetDocuments from "../hooks/useGetDocuments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import usePatchDocument from "../hooks/usePatchDocument";
import { Button } from "react-bootstrap";

interface T_Document{
  id:number
userId: number
resume: string
certificates: string
videoFile: string
}

const Tab = () => {
  const [openVideoRecorder, setVideoRecorder] = useState(false);
  const [isInformationHover, setInformationHover] = useState(false);

  const { data, isLoading } = useGetDocuments(1);

  const handleLinkClick = () => {
    sessionStorage.setItem("showSavedModal", "true");
  };
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<T_Document>()
  const {mutate:mutateDocument, isLoading:mutateIsLoading} = usePatchDocument(93)
  const onSubmit = (data: T_Document) => {

    const callBackReq = {
      onSuccess: (data: any) => {
         if(!data.error){
          toast.success("Documents Successfully Updated")
          router.push("/apply-for-a-job")
         }
      },
      onError: (err: any) => {
        //toast.error(String(err)) //uncooment this if backend is ready
       toast.success("Documents Successfully Updated") //remove this when backend is ready
       router.push("/apply-for-a-job") //remove this when backend is ready
      },
    }
  
    mutateDocument(data, callBackReq)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-x-6 lg:gap-x-12">
          <div className="col-span-1">
            <div className="grid-item">
              <h6 className="block text-indigo-dye text-sm font-medium leading-6 text-gray-900">
                Upload Resume / Curriculum Vitae
              </h6>
              <div className="mt-2 flex">
                <label
                  htmlFor="resume"
                  className="bg-white flex justify-between items-center px-3 block w-full py-2.5 ring-1 ring-gray-300 rounded-md"
                >
                  {!isLoading ? data?.resume : ""}
                  <XMarkIcon className="h-4 w-4" />
                </label>
                <input
                  type="file"
                  {...register("resume")}
                  id="resume"
                  className="hidden rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                />
              </div>
            </div>
            <div className="grid-item mt-5">
              <h6 className="block text-indigo-dye text-sm font-medium leading-6 text-gray-900">
                Upload your Certificates
              </h6>
              <div className="mt-2">
                <label
                  htmlFor="certificate"
                  className="bg-white flex justify-between items-center px-3 block w-full py-2.5 ring-1 ring-gray-300 rounded-md"
                >
                  {!isLoading ? data?.certificates : ""}
                  <XMarkIcon className="h-4 w-4" />
                </label>
                <input
                  type="file"
                  {...register("certificates")}
                  id="certificate"
                  className="hidden rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                />
              </div>
            </div>
            <div className="grid-item mt-5">
              <h6 className="flex items-center text-indigo-dye text-sm font-medium leading-6 text-gray-900">
                Upload your Intro Video
                <span className="relative">
                  <p
                    className={`${
                      isInformationHover ? "" : "hidden"
                    } absolute w-32 md:w-[210px] ml-5 md:ml-4 -translate-y-[125px] md:-translate-y-[78px] text-[10px] leading-3 z-10 whitespace-wrap bg-white border border-savoy-blue top-0 rounded-md p-3`}
                  >
                    An intro video is a video recording introducing yourself to
                    the company you’re applying for. This will help you and the
                    company fast-track your application process.
                  </p>
                  <InformationCircleIcon
                    className="h-5 w-5 ml-2 text-savoy-blue cursor-pointer"
                    onMouseEnter={() => setInformationHover(true)}
                    onMouseLeave={() => setInformationHover(false)}
                  />
                </span>
              </h6>
              <div className="mt-2">
                <label
                  htmlFor="video"
                  className="bg-white flex justify-between items-center px-3 block w-full py-2.5 ring-1 ring-gray-300 rounded-md"
                >
                  {!isLoading ? data?.videoFile : ""}
                  <XMarkIcon className="h-4 w-4" />
                </label>
                <input
                  type="file"
                 {...register("videoFile")}
                  id="video"
                  className="hidden rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                />
              </div>
              <p className="text-sm mt-2 text-indigo-dye">
                Don&#39;t have a video yet?{" "}
                <span
                  className="text-savoy-blue font-semibold cursor-pointer"
                  onClick={() => setVideoRecorder(true)}
                >
                  Create here
                </span>
                .
              </p>
            </div>
          </div>
          <div className="col-span-2 mt-4 md:mt-0">
            <h6 className="block text-indigo-dye text-sm font-medium leading-6 text-gray-900 mb-2">
              Video Preview
            </h6>
            <video controls className="w-full">
              <source
                src="https://www.youtube.com/watch?v=RjLKuWXKDLQ"
                type="video/youtube"
              />
            </video>
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
      <VideoRecorder
        open={openVideoRecorder}
        onClose={() => setVideoRecorder(false)}
      />
    </>
  );
};

export default Tab;
