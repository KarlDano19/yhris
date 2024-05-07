"use client";
import ViewDocumentModal from "@/components/ViewDocumentModal";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import VideoRecorder from "../VideoRecorder";
import { useFormContext } from "react-hook-form";

const Tab = () => {
  const [isInformationHover, setInformationHover] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoRecorder, setOpenVideoRecorder] = useState(false);
  const {register} = useFormContext()
  return (
    <>
      
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-x-6 lg:gap-x-12">
          <div className="col-span-1">
            <div className="grid-item">
              <h6 className="block text-indigo-dye text-sm font-medium leading-6 text-gray-900">
                Upload Resume / Curriculum Vitae
              </h6>
              <div className="mt-2">
                <input
                  type="file"
                  {...register("resume")}
                  id="resume"
                  className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                />
              </div>
            </div>
            <div className="grid-item mt-5">
              <h6 className="block text-indigo-dye text-sm font-medium leading-6 text-gray-900">
                Upload your Certificates
              </h6>
              <div className="mt-2">
                <input
                  type="file"
                  {...register("certificates")}
                  id="certificate"
                  className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
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
                <input
                  type="file"
                  {...register("video")}
                  id="video"
                  className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                />
              </div>
              <p className="text-sm mt-2 text-indigo-dye">
                Don&#39;t have a video yet?{" "}
                <span
                  className="text-savoy-blue font-semibold cursor-pointer"
                  onClick={() => setOpenVideoRecorder(true)}
                >
                  Create here.
                </span>
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
      
      <ViewDocumentModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <VideoRecorder
        open={videoRecorder}
        onClose={() => setOpenVideoRecorder(false)}
      />
    </>
  );
};

export default Tab;
