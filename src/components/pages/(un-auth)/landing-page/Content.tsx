"use client"
import { useState } from "react";

import Image from "next/image";

import BetaModal from "./modal/BetaModal";
import Footer from "./Footer";

import { UserIcon } from "@heroicons/react/24/solid";
import ToolsIcon from "@/svg/ToolsIcons";
import DedicatedIcon from "@/svg/DedicatedIcon";
import pexelsImage1 from "@/assets/landing-page-images/pexels-fauxels-1.png";
import pexelsImage2 from "@/assets/landing-page-images/pexels-fauxels-2.png";
import pexelsImage3 from "@/assets/landing-page-images/pexels-fauxels-3.png";
import pexelsImage4 from "@/assets/landing-page-images/pexels-fauxels-4.png";
import pexelsImage5 from "@/assets/landing-page-images/pexels-fauxels-5.png";
import pexelsImage6 from "@/assets/landing-page-images/pexels-karolina-1.png";
import pexelsImage7 from "@/assets/landing-page-images/pexels-karolina-2.png";
import pexelsImage8 from "@/assets/landing-page-images/pexels-ketut-1.png";
import pexelsImage9 from "@/assets/landing-page-images/pexels-ketut-2.png";
import pexelsImage10 from "@/assets/landing-page-images/pexels-zen-1.png";
import pexelsImage11 from "@/assets/landing-page-images/pexels-zen-2.png";
import pexelsImage12 from "@/assets/landing-page-images/pexels-tima-1.png";
import pexelsImage13 from "@/assets/landing-page-images/pexels-tima-2.png";
import pexelsImage14 from "@/assets/landing-page-images/pexels-anna-1.png";
import pexelsImage15 from "@/assets/landing-page-images/pexels-anna-2.png";


const Content = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
    >
      <div className="px-4 pt-8 pb-4">
        <div className="md:flex justify-between">
          <div className="md:w-2/4">
            <h1 className="text-3xl lg:text-[40px] lg:leading-[48px] font-semibold text-indigo-dye md:w-80 lg:w-96">
              &quot;Making HR more accessible and easy for you.&quot;
            </h1>
            <p className="text-lg text-indigo-dye lg:text-xl mt-5 md:w-80 lg:w-[410px] leading-[30px]">
              YAHSHUA HR Solutions revolutionizes the way you handle HR tasks,
              from the hiring process to employee management and separation. Our
              platform is specifically designed to simplify and automate
              repetitive HR-related processes.
            </p>
            <button
              type="button"
              className="rounded-md bg-[#FFC107] px-10 py-2.5 text-xl font-semibold text-[#16202E] shadow-sm mt-8"
            >
              Contact Us
            </button>
          </div>
          <div className="image md:w-2/4">
            <div className="relative flex justify-center mt-[60px] md:mt-36 lg:mt-[60px]">
              <Image
                className="relative w-10/12 z-10 lg:w-auto"
                src={pexelsImage1}
                width={0}
                height={0}
                alt="pexels fauxels"
              />
              <div className="absolute bottom-0 left-0">
                <Image
                  className="relative translate-y-5 translate-x-1 lg:translate-y-8 lg:-translate-x-4 w-10/12 lg:w-auto"
                  src={pexelsImage2}
                  width={0}
                  height={0}
                  alt="pexels fauxels"
                />
              </div>
              <div className="absolute top-0 right-0">
                <Image
                  className="relative -translate-y-5 translate-x-12 lg:-translate-y-8 lg:translate-x-3 w-10/12 lg:w-auto"
                  src={pexelsImage3}
                  width={0}
                  height={0}
                  alt="pexels fauxels"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-28 md:mt-24 lg:mt-32 md:gap-x-6 lg:gap-x-12 gap-y-8 sm:gap-y-0">
          <div className="card rounded-md border border-gray-300 px-4 lg:px-9 pt-8 pb-9">
            <h6 className="text-savoy-blue text-xl font-medium flex flex-row md:flex-col lg:flex-row justify-center items-center">
              <ToolsIcon className="w-5 h-5 mr-5 md:mr-0 lg:mr-5 mt-1 md:mt-0 lg:mt-1 md:mb-2 lg:mb-0" />
              Customizable
            </h6>
            <p className="text-lg text-indigo-dye mt-7 md:mt-5 lg:mt-7 text-center mx-auto leading-[22px]">
              Our system is customizable based on your needs from hiring,
              employee management, separation, and more.
            </p>
          </div>
          <div className="card rounded-md border border-gray-300 px-4 lg:px-9 pt-8 pb-9">
            <h6 className="lg:whitespace-nowrap text-savoy-blue text-xl md:text-lg lg:text-xl font-medium flex flex-row md:flex-col lg:flex-row justify-center items-center">
              <DedicatedIcon className="w-4 h-4 mr-5 md:mr-0 lg:mr-5 md:mb-[13px] lg:mb-0" />
              Dedicated Support
            </h6>
            <p className="text-lg text-indigo-dye mt-7 md:mt-5 lg:mt-7 text-center mx-auto leading-[22px]">
              When signing up to our service, we provide a dedicated HR
              consultant to assist your business with your HR.
            </p>
          </div>
          <div className="card rounded-md border border-gray-300 px-4 lg:px-8 pt-8 pb-9">
            <h6 className="text-savoy-blue text-xl font-medium flex flex-row md:flex-col lg:flex-row justify-center items-center">
              <UserIcon className="w-5 h-5 mr-5 lg:mt-1 md:mb-2 lg:mb-0" />
              Unlimited Users
            </h6>
            <p className="text-lg text-indigo-dye mt-7 md:mt-5 lg:mt-7 text-center mx-auto leading-[22px]">
              Unlike other HRIS systems, YAHSHUA HR Solutions stands apart by
              providing its robust system to unlimited users, regardless of the
              plan you choose.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-20 md:mt-24">
          <div className="md:w-[55%] lg:w-[63%]">
            <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold md:w-[400px]">
              Talent Acquisition & Applicant Tracking
            </h1>
            <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[340px] lg:w-[550px] mt-7">
              YAHSHUA HR Solutions streamlines the recruitment and onboarding
              process through the power of automation. Our platform automates
              essential tasks such as job posting, applicant data management,
              talent acquisition process tracking and candidate information
              organization, allowing you to focus on what matters most: finding
              and welcoming the best talent to your team.
            </p>
          </div>
          <div className="w-[80%] md:w-[45%] lg:w-[37%] flex md:items-center lg:items-end mt-16 md:mt-0 mx-auto md:mx-0">
            <div className="relative md:translate-y-10 lg:translate-y-1">
              <Image
                className="z-10 relative"
                src={pexelsImage4}
                width={0}
                height={0}
                alt="pexels fauxels"
              />
              <div className="absolute top-0 left-0">
                <Image
                  className="relative -translate-y-9 -translate-x-9"
                  src={pexelsImage5}
                  width={0}
                  height={0}
                  alt="pexels fauxels"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:justify-between mt-16 lg:mt-24">
          <div className="w-[80%] md:w-[45%] lg:w-[37%] flex md:items-center lg:items-end mx-auto md:mx-0 mt-10 md:mt-0">
            <div className="relative md:translate-y-2 lg:translate-y-6">
              <Image
                className="z-10 relative"
                src={pexelsImage6}
                width={0}
                height={0}
                alt="pexels karolina"
              />
              <div className="absolute bottom-0 right-0">
                <Image
                  className="relative translate-y-9 translate-x-12"
                  src={pexelsImage7}
                  width={0}
                  height={0}
                  alt="pexels karolina"
                />
              </div>
            </div>
          </div>
          <div className="md:w-[55%] lg:w-[63%]">
            <div className="float-right">
              <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold">
                Employee Self-service
              </h1>
              <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[330px] lg:w-[550px] mt-7">
                YAHSHUA HR Solutions empowers employees with a self-service
                Employee Portal, enabling them to easily update personal
                information, submit leave requests, view payroll details, and
                access a wide range of other HR-related information.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-20 md:mt-20 lg:mt-36">
          <div className="md:w-[55%] lg:w-[63%]">
            <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold w-auto">
              Employee Management
            </h1>
            <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[340px] lg:w-[580px] mt-7">
              Create memos and policies effortlessly with YAHSHUA HR. Our
              platform simplifies the process, allowing you to generate
              professional memos and policies in just a few steps. You can
              swiftly draft and release important communications to your
              employees, ensuring clarity and consistency across your
              organization.
            </p>
          </div>
          <div className="w-[80%] md:w-[45%] lg:w-[37%] flex items-end mx-auto md:mx-0 mt-16 md:mt-0">
            <div className="relative">
              <Image
                className="z-10 relative"
                src={pexelsImage9}
                width={0}
                height={0}
                alt="pexels ketut"
              />
              <div className="absolute top-0 left-0">
                <Image
                  className="relative -translate-y-10 -translate-x-10"
                  src={pexelsImage8}
                  width={0}
                  height={0}
                  alt="pexels ketut"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:justify-between mt-16 lg:mt-24">
          <div className="w-[80%] md:w-[45%] lg:w-[37%] md:flex md:items-center lg:block mx-auto md:mx-0 mt-10 md:mt-0">
            <div className="relative">
              <Image
                className="z-10 relative"
                src={pexelsImage10}
                width={0}
                height={0}
                alt="pexels zen"
              />
              <div className="absolute bottom-0 right-0">
                <Image
                  className="relative translate-y-9 translate-x-11 md:translate-x-7 lg:translate-x-12"
                  src={pexelsImage11}
                  width={0}
                  height={0}
                  alt="pexels zen"
                />
              </div>
            </div>
          </div>
          <div className="md:w-[55%] lg:w-[63%]">
            <div className="float-right">
              <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold">
                Orientation & Separation
              </h1>
              <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[350px] lg:w-[550px] mt-7">
                Streamline and simplify onboarding and off boarding process when
                employees arrive in the company or depart from the company. With
                YAHSHUA HR Solutions, you can effortlessly manage both
                onboarding and offboarding, ensuring a smooth transition for
                all.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-20 lg:mt-36">
          <div className="md:w-[55%] lg:w-[63%]">
            <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold md:w-[400px]">
              Payroll & Benefits Management
            </h1>
            <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[340px] lg:w-[550px] mt-7">
              Experience seamless end-to-end Payroll process from Timekeeper
              equipped with facial recognition technology, up to the generation
              of payroll and related reports.
            </p>
          </div>
          <div className="w-[80%] md:w-[45%] lg:w-[37%] flex md:items-center lg:items-end mx-auto md:mx-0 mt-16 md:mt-0">
            <div className="relative md:translate-y-8 lg:translate-y-6">
              <Image
                className="z-10 relative"
                src={pexelsImage12}
                width={0}
                height={0}
                alt="pexels tima"
              />
              <div className="absolute top-0 left-0">
                <Image
                  className="relative -translate-y-10 -translate-x-10"
                  src={pexelsImage13}
                  width={0}
                  height={0}
                  alt="pexels tima"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:justify-between mt-16 lg:mt-24">
          <div className="w-[80%] md:w-[45%] lg:w-[37%] md:flex md:items-center lg:block mx-auto md:mx-0 mt-4 md:mt-0">
            <div className="relative translate-y-5">
              <Image
                className="z-10 relative"
                src={pexelsImage14}
                width={0}
                height={0}
                alt="pexels anna"
              />
              <div className="absolute bottom-0 right-0">
                <Image
                  className="relative translate-y-10 translate-x-11 md:translate-x-8 lg:translate-x-12"
                  src={pexelsImage15}
                  width={0}
                  height={0}
                  alt="pexels anna"
                />
              </div>
            </div>
          </div>
          <div className="md:w-[55%] lg:w-[63%]">
            <div className="float-right">
              <h1 className="text-3xl lg:text-[40px] leading-[48px] text-savoy-blue font-semibold">
                Training & Development
              </h1>
              <p className="text-lg lg:text-xl text-indigo-dye leading-[30px] md:w-[340px] lg:w-[565px] mt-7">
                Transform your employee training into an exciting and immersive
                experience. With our innovative platform, you gain access to a
                dynamic training tool that enables you to store all your
                learning materials in one place. Additionally, you can
                effortlessly track and monitor employee progress and records,
                ensuring a seamless and organized training process. Elevate your
                training initiatives with our engaging platform and witness the
                growth and development of your workforce.
              </p>
            </div>
          </div>
        </div>
        <BetaModal isOpen={isOpen} setIsOpen={setIsOpen} />
        <Footer />
      </div>
    </div>
  );
};

export default Content;
