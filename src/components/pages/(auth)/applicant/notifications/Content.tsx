"use client";
import Image from "next/image";
import findFaceEmoji from "@/assets/find-face-emoji.png";

import CardProfile from "../apply-for-job/CardProfile";
import CardRecentApp from "../apply-for-job/CardRecentApp";
import profileImage from "@/assets/Ellipse 8.png";
import { useState } from "react";
import useGetNotifications from "./hooks/useGetNotifications";


interface Notification{
  id:number,
  userId:number,
  message:string
}
const Content = () => {
  const [isNotifClicked, setNotifClicked] = useState(false);
  const {data, isLoading} = useGetNotifications(93)
  console.log(data)
  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
    >
      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-6 gap-x-6 lg:px-4 py-8">
        <div className="md:col-span-3 lg:col-span-2">
          <CardProfile />
          <CardRecentApp />
        </div>
        <div className="md:col-span-5 lg:col-span-4 bg-white border border-gray-300 h-auto rounded-lg shadow py-7 mt-8 md:mt-0">
          <h4 className="text-lg md:text-2xl text-indigo-dye flex items-center font-bold px-5 md:font-semibold">
            Hear the latest updates!
            <Image
              className="ml-1.5 h-6 w-6"
              src={findFaceEmoji}
              width={0}
              height={0}
              alt="Find face emoji"
            />
          </h4>
          {!isLoading?(
                  data?.map((notif:Notification, index:number)=>(
          <div className="mt-5 md:mt-8" key={index}>
            <div
              className={`${
                isNotifClicked ? "bg-[#EBF3FF]" : "bg-white"
              } notification-texts hover:bg-[#EBF3FF] px-5 py-5 cursor-pointer border-b border-gray-200`}
              onClick={() => setNotifClicked(true)}
            >
              
              <div className="flex flex-col md:flex-row lg:items-center md:space-x-4 relative">
                <div className="flex items-center md:items-start lg:items-center md:space-x-4">
                  <div
                    className={`${
                      isNotifClicked ? "lg:hidden bg-transparent" : ""
                    } circle-active h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-0 md:mt-5 lg:mt-0 bg-savoy-blue rounded-full`}
                  ></div>
                  <div className="h-14 w-[60px] md:h-16 md:w-[70px] rounded-lg bg-gray-200 overflow-hidden">
                    <Image
                      className="hidden"
                      src={profileImage}
                      width={0}
                      height={0}
                      alt="company image"
                    />
                  </div>
                </div>
                <p className="text-indigo-dye mt-3 ml-6 md:mt-0 md:ml-0 text-[15px] md:w-[60%] lg:w-[74%] leading-5">
                 {notif.message}
                </p>
                <span className="absolute text-[15px] text-[#6F829B] top-0 right-0">
                  12h
                </span>
              </div>
              
            </div>
          </div>
          ))): <div className="text-center">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default Content;
